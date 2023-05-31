import { withSessionSSR } from "@/lib/AuthSession/session";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import ObservedBlockList from "@/models/ObservedBlockList";
import { Postsstats } from "@/models/Post";
import { hasCookie } from "cookies-next";
import { formatISO } from "date-fns";

interface Options {
  accepted?: boolean;
  author?: {
    $nin?: string[];
    $in?: string[];
  };
  addTime?: {
    $gt: string;
    $lt?: string;
  };
  category?:
    | string
    | {
        $in: string[];
      };
  tags?: {
    $in: string[];
  };
  title?: any;
  memContainers?: any;
}

const getPosts = (
  options: Options,
  asPage: boolean = false,
  personalType?: "USER" | "TAG" | "SECTION"
) =>
  withSessionSSR(async function getServerSideProps({
    req,
    query,
  }): Promise<any> {
    const session = req.session?.user;
    await dbConnect();

    const page = Number(query.page || 1);
    const category = query?.category;

    if (Number.isNaN(page) || category !== undefined) {
      if ((category as string)?.length > 0) {
      } else
        return {
          notFound: true,
        };
    }

    const datePreset = query?.["date-preset"];
    const from = query?.from;
    const to = query?.to;

    if (
      datePreset &&
      ["6h", "12h", "24h", "48h", "7d"].includes(datePreset as string)
    ) {
      const preset: {
        [key: string]: Date;
      } = {
        "6h": (() => {
          const date = new Date();
          date.setHours(date.getHours() - 6);
          return date;
        })(),
        "12h": (() => {
          const date = new Date();
          date.setHours(date.getHours() - 12);
          return date;
        })(),
        "24h": (() => {
          const date = new Date();
          date.setDate(date.getDate() - 1);
          return date;
        })(),
        "48h": (() => {
          const date = new Date();
          date.setDate(date.getDate() - 2);
          return date;
        })(),
        "7d": (() => {
          const date = new Date();
          date.setDate(date.getDate() - 7);
          return date;
        })(),
      };
      options = {
        ...options,
        addTime: {
          $gt: formatISO(preset[datePreset as string]),
        },
      };
    } else if (from && to) {
      const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
      if (dateRegex.test(from as string) && dateRegex.test(to as string)) {
        options = {
          ...options,
          addTime: {
            $gt: formatISO(new Date(from as string)),
            $lt: formatISO(new Date(to as string)),
          },
        };
      }
    }

    const pharse = query?.pharse as string;
    const video = Boolean(query?.video);
    const image = Boolean(query?.image);
    const gif = Boolean(query?.gif);
    const text = Boolean(query?.text);

    if (pharse) {
      options = {
        ...options,
        title: { $regex: pharse, $options: "i" },
      };
    } else {
      delete options.title;
    }

    if (video || image || gif || text) {
      const toSearch = [
        video ? { type: "video" } : null,
        image ? { type: "image" } : null,
        gif ? { type: "gif" } : null,
        text ? { type: "text" } : null,
      ].filter((item) => item !== null);

      options = {
        ...options,
        memContainers: {
          $elemMatch: {
            $or: toSearch,
          },
        },
      };
    } else {
      delete options.memContainers;
    }

    if (!datePreset && !to && !from) {
      delete options.addTime;
    }

    let findOptions: Options = options;
    console.log(findOptions);

    let checkCategory: any;

    if (category) {
      checkCategory = await Category.findOne({
        slug: category,
        asPage,
      });
      if (!checkCategory)
        return {
          notFound: true,
        };

      if (!session?.logged || !session?.login)
        return {
          redirect: {
            destination: "/logowanie",
            permament: false,
          },
        };
      else {
        if (!hasCookie("ofage", { req }) && checkCategory.nsfw)
          return {
            props: {
              ofage: false,
              nsfw: true,
            },
          };
        options.category = category as string;
      }
    }

    if (session?.logged && session?.login) {
      findOptions.author = {
        $nin: (
          await ObservedBlockList.find({
            username: session?.login,
            type: "USER",
            method: "BLOCK",
          })
        ).map((item) => item.name),
      };
      if (personalType === "USER") {
        const observedUsers = (
          await ObservedBlockList.find({
            username: session.login,
            type: "USER",
            method: "FOLLOW",
          })
        ).map((item) => item.name);

        if (observedUsers.length === 0)
          return {
            props: {
              noFollowed: true,
            },
          };

        findOptions.author = {
          ...findOptions.author,
          $in: observedUsers,
        };
      } else if (personalType === "SECTION") {
        const observedSections = (
          await ObservedBlockList.find({
            username: session.login,
            type: "SECTION",
            method: "FOLLOW",
          })
        ).map((item) => item.name);

        if (observedSections.length === 0)
          return {
            props: {
              noFollowed: true,
            },
          };

        findOptions.category = {
          $in: observedSections,
        };
      } else if (personalType === "TAG") {
        const observedTags = (
          await ObservedBlockList.find({
            username: session.login,
            type: "TAG",
            method: "FOLLOW",
          })
        ).map((item) => item.name);

        if (observedTags.length === 0)
          return {
            props: {
              noFollowed: true,
            },
          };

        findOptions.tags = {
          $in: observedTags,
        };
      }
    }

    const allPosts = await Postsstats.count(findOptions);
    Postsstats.find({ $text: { $search: pharse } });

    const allPages = Math.ceil(allPosts / 8);

    let posts = await Postsstats.find(findOptions)
      .sort({ addTime: -1 })
      .skip((page - 1) * 8)
      .limit(8);

    if (!session?.logged || !session?.login) {
      posts = posts.map((item) => {
        const newObject = { ...item._doc };
        delete newObject.user;
        return newObject;
      });
    }

    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
        currentPage: page,
        allPages,
        ...(checkCategory
          ? {
              category: checkCategory.name,
              categorySlug: checkCategory.slug,
              nsfw: checkCategory.nsfw,
              ofage: hasCookie("ofage", { req }),
            }
          : {}),
      },
    };
  });

export default getPosts;

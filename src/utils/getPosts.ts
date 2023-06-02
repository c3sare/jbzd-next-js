import { withSessionSSR } from "@/lib/AuthSession/session";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import Favourite from "@/models/Favourite";
import ObservedBlockList from "@/models/ObservedBlockList";
import { Postsstats } from "@/models/Post";
import { hasCookie } from "cookies-next";
import { formatISO } from "date-fns";
import { Types } from "mongoose";

interface ListsInterface {
  user: {
    follow: string[];
    block: string[];
  };
  tag: {
    follow: string[];
    block: string[];
  };
  section: {
    follow: string[];
  };
}

interface Options {
  _id?: { $in?: Types.ObjectId[] };
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
    $in?: string[];
    $nin?: string[];
  };
  title?: any;
  memContainers?: any;
}

const getPosts = (
  options: Options,
  asPage: boolean = false,
  personalType: "USER" | "TAG" | "SECTION" | "FAVOURITES" | "",
  tag: boolean = false
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
        if (checkCategory.nsfw || checkCategory.asPage)
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

    let lists: any[] | ListsInterface | null = null;

    if (session?.logged && session?.login) {
      lists = await ObservedBlockList.find({
        username: session?.login,
      });
      lists = {
        user: {
          follow: lists
            .filter((item) => item.type === "USER" && item.method === "FOLLOW")
            .map((item) => item.name),
          block: lists
            .filter((item) => item.type === "USER" && item.method === "BLOCK")
            .map((item) => item.name),
        },
        tag: {
          follow: lists
            .filter((item) => item.type === "TAG" && item.method === "FOLLOW")
            .map((item) => item.name),
          block: lists
            .filter((item) => item.type === "TAG" && item.method === "BLOCK")
            .map((item) => item.name),
        },
        section: {
          follow: lists
            .filter(
              (item) => item.type === "SECTION" && item.method === "FOLLOW"
            )
            .map((item) => item.name),
        },
      } as ListsInterface;

      findOptions.author = {
        $nin: lists.user.block,
      };
      findOptions.tags = {
        $nin: lists.tag.block,
      };
      if (personalType === "USER") {
        const observedUsers = lists.user.follow;

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
        const observedSections = lists.section.follow;

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
        const observedTags = lists.tag.follow;

        if (observedTags.length === 0)
          return {
            props: {
              noFollowed: true,
            },
          };

        findOptions.tags = {
          $in: observedTags,
        };
      } else if (personalType === "FAVOURITES") {
        const favourites = (
          await Favourite.collection.find({ username: session.login }).toArray()
        ).map((item) => new Types.ObjectId(item.post));
        findOptions._id = {
          $in: favourites,
        };
      }
    }

    if (tag) {
      findOptions = {
        ...findOptions,
        tags: { $in: [query.tag as string] },
      };
    }

    const allPosts = await Postsstats.count(findOptions);

    if (allPosts === 0 && tag)
      return {
        notFound: true,
      };

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

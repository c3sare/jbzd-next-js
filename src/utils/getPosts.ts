import { withSessionSSR } from "@/lib/AuthSession/session";
import dbConnect from "@/lib/dbConnect";
import Blacklist from "@/models/Blacklist";
import Category from "@/models/Category";
import { Postsstats } from "@/models/Post";
import { hasCookie } from "cookies-next";
import { formatISO } from "date-fns";

interface Options {
  accepted?: boolean;
  author?: {
    $nin?: string[];
  };
  addTime?: {
    $gt: string;
    $lt?: string;
  };
  category?: string;
}

const getPosts = (options: Options, asPage: boolean = false) =>
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
        $nin: (await Blacklist.find({ username: session?.login })).map(
          (item) => item.user
        ),
      };
    }
    const allPosts = await Postsstats.count(findOptions);

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
              nsfw: checkCategory.nsfw,
              ofage: hasCookie("ofage", { req }),
            }
          : {}),
      },
    };
  });

export default getPosts;

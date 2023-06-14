import { withSessionSSR } from "@/lib/AuthSession/session";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import Favourite from "@/models/Favourite";
import ObservedBlockList from "@/models/ObservedBlockList";
import { Postsstats } from "@/models/Post";
import { hasCookie } from "cookies-next";
import { formatISO } from "date-fns";
import { FilterQuery, Types } from "mongoose";
import getPostsWithStats from "@/data/getPosts";
import createObservedBlockGroup from "./createObservedBlockGroup";

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

const getPosts = ({
  options,
  categoryAsMainPageLink,
}: {
  options: FilterQuery<any>;
  categoryAsMainPageLink: boolean;
}) =>
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

    let findOptions: FilterQuery<any> = options;

    let checkCategory: any;

    if (category) {
      checkCategory = await Category.findOne({
        slug: category,
        asPage: categoryAsMainPageLink,
      });
      if (!checkCategory)
        return {
          notFound: true,
        };

      if (!session?.logged || !session?.login) {
        if (checkCategory.nsfw || checkCategory.asPage) {
          return {
            redirect: {
              destination: "/logowanie",
              permament: false,
            },
          };
        } else {
          options.category = category as string;
        }
      } else {
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
      lists = createObservedBlockGroup(lists) as ListsInterface;

      findOptions.author = {
        $nin: lists.user.block,
      };
      findOptions.tags = {
        $nin: lists.tag.block,
      };
    }

    const allPosts = await Postsstats.count(findOptions);

    const allPages = Math.ceil(allPosts / 8);

    let posts = await getPostsWithStats(findOptions, { addTime: -1 }, session, {
      limit: 8,
      skip: (page - 1) * 8,
    });
    let isFollowedCategory = false;

    if (session?.logged && session?.login) {
      isFollowedCategory = Boolean(
        await ObservedBlockList.exists({
          type: "SECTION",
          username: session.login,
          method: "FOLLOW",
        })
      );
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
              isFollowedCategory,
            }
          : {}),
      },
    };
  });

export default getPosts;

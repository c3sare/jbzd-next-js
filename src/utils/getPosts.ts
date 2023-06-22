import { withSessionSSR } from "@/lib/AuthSession/session";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import Favourite from "@/models/Favourite";
import ObservedBlockList from "@/models/ObservedBlockList";
import { Postsstats } from "@/models/Post";
import { hasCookie } from "cookies-next";
import { FilterQuery, Types } from "mongoose";
import getPostsWithStats from "@/data/getPosts";
import dateFilter from "./dateFilter";
import filterPostByPharseType from "./filterPostByPharseType";

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
  asPage = false,
  personalType,
  tag = false,
}: {
  options: FilterQuery<any>;
  asPage?: boolean;
  personalType?: "USER" | "TAG" | "SECTION" | "FAVOURITES";
  tag?: boolean;
}) =>
  withSessionSSR(async function getServerSideProps({
    req,
    query,
  }): Promise<any> {
    const session = req.session?.user;
    await dbConnect();

    const page = Number(query.page || 1);
    const category = query?.category;

    if (!category) {
      delete options.category;
    }

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

    const filterOptionsByDate = dateFilter(query);
    const filterOptionsByTypePharse = filterPostByPharseType(query);

    options = {
      ...options,
      ...filterOptionsByDate,
      ...filterOptionsByTypePharse,
    };

    const pharse = query?.pharse as string;
    const video = Boolean(query?.video);
    const image = Boolean(query?.image);
    const gif = Boolean(query?.gif);
    const text = Boolean(query?.text);

    if (!pharse) {
      delete options.title;
    }

    if (!video && !image && !gif && !text) {
      delete options.memContainers;
    }

    if (!datePreset && !to && !from) {
      delete options.addTime;
    }

    let findOptions: FilterQuery<any> = options;

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

    const categorySearch = checkCategory
      ? {
          category: checkCategory.name,
          categorySlug: checkCategory.slug,
          nsfw: checkCategory.nsfw,
          ofage: hasCookie("ofage", { req }),
          isFollowedCategory,
        }
      : {};

    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
        currentPage: page,
        allPages,
        ...categorySearch,
      },
    };
  });

export default getPosts;

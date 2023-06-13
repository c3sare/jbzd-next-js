import Badge from "@/models/Badge";
import Favourite from "@/models/Favourite";
import { Postsstats } from "@/models/Post";
import { FilterQuery, ObjectId } from "mongoose";
import type { Badge as BadgeType } from "@/types/Badge";
import type { Favourite as FavouriteType } from "@/types/Favourite";
import type { ObservedBlockList as ObservedBlockListType } from "@/types/ObservedBlockList";
import ObservedBlockList from "@/models/ObservedBlockList";
import type { User } from "@/lib/AuthSession/session";

interface PostWithStatsInterface {
  _id: ObjectId | string;
  title: string;
  addTime: Date;
  author: string;
  category: string;
  memContainers: {
    type: "image" | "video" | "text" | "youtube" | "gif";
    data: string;
  }[];
  accepted: boolean;
  tags: string[];
  user?: {
    _id: ObjectId;
    username: string;
    avatar: string;
    premiumExpires: Date;
    spears: number;
    rank: number;
    userMethod?: "FOLLOW" | "BLOCK" | "";
  };
  comments: number;
  plus: number;
  rock: number;
  silver: number;
  gold: number;
  isPlused?: boolean;
  isFavourite?: boolean;
}

export default async function getPosts(
  filter: FilterQuery<PostWithStatsInterface>,
  sort: { [P in keyof PostWithStatsInterface]?: -1 | 1 },
  session: User | undefined,
  options: { limit?: number; skip?: number }
) {
  let posts: PostWithStatsInterface[] = await Postsstats.find(filter)
    .sort(sort)
    .skip(options?.skip || 0)
    .limit(options?.limit || 0);

  if (session?.logged && session?.login) {
    const postsIds = posts.map((post) => post._id);

    const postAuthors = posts.map((post) => post.author);
    const uniquePostAuthors = postAuthors.filter(
      (author, i) => postAuthors.indexOf(author) === i
    );

    const favouritePostsList = (await Favourite.find({
      username: session.login,
      post: { $in: postsIds },
      type: "POST",
    } as FilterQuery<FavouriteType>)) as FavouriteType[];

    const plusedPostsList = JSON.parse(
      JSON.stringify(
        await Badge.find({
          author: session.login,
          where: "POST",
          type: "PLUS",
          id: { $in: postsIds },
        } as FilterQuery<BadgeType>)
      )
    ) as BadgeType[];

    const blockedFollowedUsers = JSON.parse(
      JSON.stringify(
        await ObservedBlockList.find({
          username: session.login,
          name: { $in: uniquePostAuthors },
          type: "USER",
        } as FilterQuery<ObservedBlockListType>)
      )
    ) as ObservedBlockListType[];

    posts = JSON.parse(JSON.stringify(posts));

    posts = posts.map((post) => {
      post.isPlused =
        Boolean(
          plusedPostsList.find((plusedPost) => plusedPost.id === post._id)
        ) || false;
      post.isFavourite =
        Boolean(
          favouritePostsList.find((favourite) => favourite.post === post._id)
        ) || false;
      post.user!.userMethod =
        blockedFollowedUsers.find((user) => user.name === post.author)
          ?.method || "";

      return post;
    });
  } else {
    posts = posts.map((post) => {
      delete post.user;

      return post;
    });
  }

  return posts;
}

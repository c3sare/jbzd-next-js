import { Postsstats } from "@/models/Post";
import { FilterQuery, ObjectId } from "mongoose";

interface PostWithStatsInterface {
  _id: ObjectId;
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
  user: {
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

export default async function getComments(
  filter: FilterQuery<PostWithStatsInterface>,
  sort: { [P in keyof PostWithStatsInterface]: -1 | 1 },
  session: { logged?: boolean; login?: string }
) {
  const posts = (await Postsstats.find(filter).sort(
    sort
  )) as PostWithStatsInterface[];

  return posts;
}

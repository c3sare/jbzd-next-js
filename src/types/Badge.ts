import { ObjectId } from "mongoose";

export type Badge = {
  _id: ObjectId | string;
  author: string;
  where: "POST" | "COMMENT" | "PROFILE";
  type: "PLUS" | "MINUS" | "ROCK" | "SILVER" | "GOLD";
  id: ObjectId | string;
  addTime: Date;
};

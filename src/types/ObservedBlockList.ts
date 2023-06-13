import { ObjectId } from "mongoose";

export type ObservedBlockList = {
  _id: string | ObjectId;
  username: string;
  name: string;
  type: "TAG" | "USER" | "SECTION";
  method: "FOLLOW" | "BLOCK";
  addTime: Date;
};

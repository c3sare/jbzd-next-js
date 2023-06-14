import { Schema, model, ObjectId } from "mongoose";
import type CommentstatsInterface from "@/types/Commentstats";

export interface CommentInterface {
  author: string;
  post: ObjectId;
  addTime: string | Date;
  precedent: null | ObjectId;
  text: string;
  _id?: string;
}

const commentSchema = new Schema<CommentInterface>({
  author: String,
  post: Schema.Types.ObjectId,
  addTime: Date,
  precedent: Schema.Types.Mixed,
  text: String,
});

export const Commentstats =
  model<CommentstatsInterface>("commentstats") ||
  model<CommentstatsInterface>("commentstats", commentSchema as any);

export const AllComments =
  model<CommentInterface>("subcommentstats") ||
  model<CommentInterface>("subcommentstats", commentSchema);

const Comment =
  model<CommentInterface>("Comment") ||
  model<CommentInterface>("Comment", commentSchema);

export default Comment;

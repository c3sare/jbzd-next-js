import { Schema, model, ObjectId, models } from "mongoose";
import type CommentstatsInterface from "@/types/Commentstats";
import type SubcommentstatsInterface from "@/types/Subcommentstats";

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
  models.commentstats ||
  model<CommentstatsInterface>("commentstats", commentSchema as any);

export const AllComments =
  models.subcommentstats ||
  model<SubcommentstatsInterface>("subcommentstats", commentSchema as any);

const Comment =
  models.Comment || model<CommentInterface>("Comment", commentSchema);

export default Comment;

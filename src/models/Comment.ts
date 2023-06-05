import { Schema, models, model, ObjectId } from "mongoose";

export interface Comment {
  author: string;
  post: ObjectId;
  addTime: string | Date;
  precedent: null | ObjectId;
  text: string;
  _id?: string;
}

const commentSchema = new Schema<Comment>({
  author: String,
  post: Schema.Types.ObjectId,
  addTime: Date,
  precedent: Schema.Types.Mixed,
  text: String,
});

export const Commentstats =
  models.commentstats || model<Comment>("commentstats", commentSchema);

export default models.Comment || model<Comment>("Comment", commentSchema);

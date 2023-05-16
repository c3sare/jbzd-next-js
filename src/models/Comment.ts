import { Schema, models, model, ObjectId } from "mongoose";

interface Comment {
  author: string;
  post: ObjectId;
  addTime: Date;
  precedent: null | ObjectId;
  text: string;
}

const commentSchema = new Schema<Comment>({
  author: String,
  post: Schema.Types.ObjectId,
  addTime: Date,
  precedent: Schema.Types.Mixed,
  text: String,
});

export default models.Comment || model<Comment>("Comment", commentSchema);

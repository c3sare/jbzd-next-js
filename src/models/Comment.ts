import { Schema, models, model } from "mongoose";

interface Comment {
  author: string;
  post: string;
  pluses: number;
  rock: number;
  silver: number;
  gold: number;
  addTime: Date;
  precedent: string;
}

const commentSchema = new Schema<Comment>({
  author: { type: String, required: true },
  post: { type: String, required: true },
  pluses: { type: Number, required: true },
  rock: { type: Number, required: true },
  silver: { type: Number, required: true },
  gold: { type: Number, required: true },
  addTime: { type: Date, required: true },
  precedent: { type: String, required: true },
});

export default models.Comment || model<Comment>("Comment", commentSchema);

import { Schema, models, model, Types } from "mongoose";

interface MemContainer {
  type: string;
  data: string;
}

interface Post {
  title: string;
  addTime: Date;
  author: string;
  category: string;
  pluses: number;
  rock: number;
  silver: number;
  gold: number;
  memContainers: Types.DocumentArray<MemContainer>;
  accepted: boolean;
}

const postSchema = new Schema<Post>({
  title: { type: String, required: true },
  addTime: { type: Date, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  pluses: { type: Number, required: true },
  rock: { type: Number, required: true },
  silver: { type: Number, required: true },
  gold: { type: Number, required: true },
  memContainers: [
    {
      type: String,
      data: String,
    },
  ],
  accepted: { type: Boolean, required: true },
});

export default models.Post || model<Post>("Post", postSchema);

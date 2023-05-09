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
  memContainers: Types.DocumentArray<MemContainer>;
  accepted: boolean;
  tags: Types.DocumentArray<string>;
}

const postSchema = new Schema<Post>({
  title: String,
  addTime: Date,
  author: String,
  category: String,
  memContainers: [
    {
      type: String,
      data: String,
    },
  ],
  accepted: Boolean,
  tags: [String],
});

export default models.Post || model<Post>("Post", postSchema);

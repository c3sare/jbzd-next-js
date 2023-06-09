import { Schema, models, model, Types } from "mongoose";

interface MemContainer {
  dtype: string;
  data: string;
}

interface PostInterface {
  title: string;
  addTime: Date;
  author: string;
  category: string;
  memContainers: Types.DocumentArray<MemContainer>;
  accepted: boolean;
  tags?: Types.DocumentArray<string>;
}

const postSchema = new Schema<PostInterface>({
  title: String,
  addTime: Date,
  author: String,
  category: String,
  memContainers: [
    {
      type: { type: String },
      data: { type: String },
    },
  ],
  accepted: Boolean,
  tags: [String],
});

const Post = models.Post || model<PostInterface>("Post", postSchema);

export default Post;

export const Postsstats = models.Postsstat || model("Postsstat", postSchema);

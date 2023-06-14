import { Schema, model, models } from "mongoose";

interface Category {
  name: string;
  nsfw: boolean;
  slug: string;
  asPage: boolean;
  color: string;
  hide: boolean;
}

const categorySchema = new Schema<Category>({
  name: { type: String, required: true },
  nsfw: { type: Boolean, required: true },
  slug: { type: String, required: true },
  asPage: { type: Boolean, required: true },
  color: { type: String, required: true },
  hide: { type: Boolean, required: true },
});

const Category = models.Category || model<Category>("Category", categorySchema);

export default Category;

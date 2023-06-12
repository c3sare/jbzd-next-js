import { Schema, models, model, Date } from "mongoose";

interface Favourite {
  username: string;
  post: string;
  addTime: Date;
  type: "POST" | "COMMENT";
}

const favouriteSchema = new Schema<Favourite>({
  username: { type: String, required: true },
  post: { type: String, required: true },
  addTime: { type: Date, required: true },
  type: { type: String },
});

export default models.Favourite ||
  model<Favourite>("Favourite", favouriteSchema);

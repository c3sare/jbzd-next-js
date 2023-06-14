import { Schema, model, Date } from "mongoose";

interface FavouriteInterface {
  username: string;
  post: string;
  addTime: Date;
  type: "POST" | "COMMENT";
}

const favouriteSchema = new Schema<FavouriteInterface>({
  username: { type: String, required: true },
  post: { type: String, required: true },
  addTime: { type: Date, required: true },
  type: { type: String },
});

const Favourite =
  model<FavouriteInterface>("Favourite") ||
  model<FavouriteInterface>("Favourite", favouriteSchema);

export default Favourite;

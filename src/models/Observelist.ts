import { Schema, models, model, Date } from "mongoose";

export interface ObservelistInterface {
  username: string;
  user: string;
  addTime: Date;
}

const observelistSchema = new Schema<ObservelistInterface>({
  username: String,
  user: String,
  addTime: Date,
});

export default models.Observelist ||
  model<ObservelistInterface>("Observelist", observelistSchema);

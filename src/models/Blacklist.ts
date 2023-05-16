import { Schema, models, model, Date } from "mongoose";

export interface BlacklistInterface {
  username: string;
  user: string;
  addTime: Date;
}

const blacklistSchema = new Schema<BlacklistInterface>({
  username: String,
  user: String,
  addTime: Date,
});

export default models.Blacklist ||
  model<BlacklistInterface>("Blacklist", blacklistSchema);

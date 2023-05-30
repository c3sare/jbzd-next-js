import { Schema, models, model, Date } from "mongoose";

export interface ObserveBlockListInterface {
  username: string;
  name: string;
  type: "USER" | "SECTION" | "TAG";
  method: "FOLLOW" | "BLOCK";
  addTime: Date;
}

const observeBlockListSchema = new Schema<ObserveBlockListInterface>({
  username: String,
  name: String,
  type: { type: String },
  method: String,
  addTime: Date,
});

export default models.ObservedBlockList ||
  model<ObserveBlockListInterface>("ObservedBlockList", observeBlockListSchema);

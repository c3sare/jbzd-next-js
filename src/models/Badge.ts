import { Schema, models, model, Date } from "mongoose";

export interface BadgeInterface {
  author: string;
  where: "POST" | "COMMENT" | "PROFILE";
  type: "PLUS" | "MINUS" | "ROCK" | "SILVER" | "GOLD" | "SPEAR";
  id: string;
  addTime: Date;
}

const badgeSchema = new Schema<BadgeInterface>({
  author: { type: String, required: true },
  where: { type: String, required: true },
  type: { type: String, required: true },
  id: { type: String, required: true },
  addTime: { type: Date, required: true },
});

export default models.Badge || model<BadgeInterface>("Badge", badgeSchema);

import { Schema, model, Date, Types } from "mongoose";

export interface BadgeInterface {
  author: string;
  where: "POST" | "COMMENT" | "PROFILE";
  type: "PLUS" | "MINUS" | "ROCK" | "SILVER" | "GOLD" | "SPEAR";
  id: Types.ObjectId;
  addTime: Date;
}

const badgeSchema = new Schema<BadgeInterface>({
  author: { type: String, required: true },
  where: { type: String, required: true },
  type: { type: String, required: true },
  id: { type: Schema.Types.ObjectId, required: true },
  addTime: { type: Date, required: true },
});

const Badge =
  model<BadgeInterface>("Badge") || model<BadgeInterface>("Badge", badgeSchema);

export default Badge;

import { Schema, models, model } from "mongoose";

export interface User {
  username: string;
  email: string;
  createDate: string;
  avatar: string;
  password: string;
  birthday: string;
  city: string;
  country: string;
  gender: 0 | 1 | 2 | 3;
  name: string;
  notify: {
    newOrders: boolean;
    pins: boolean;
    commentsOnMain: boolean;
    newComments: boolean;
  };
  coins: number;
  token: string;
  confirmed: boolean;
}

export const userSchema = new Schema<User>({
  username: String,
  email: String,
  createDate: Date,
  avatar: String,
  password: String,
  birthday: String,
  city: String,
  country: String,
  gender: Number,
  name: String,
  notify: Object,
  coins: Number,
  token: String,
  confirmed: Boolean,
});

export default models.User || model<User>("User", userSchema);

export const Usersprofiles =
  models.usersprofiles || model("usersprofiles", userSchema);

export const Usersposts = models.usersposts || model("usersposts", userSchema);

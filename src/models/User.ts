import { Schema, models, model } from "mongoose";

interface User {
  username: string;
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

const userSchema = new Schema<User>({
  username: { type: String, required: true },
  createDate: { type: String, required: true },
  avatar: { type: String, required: true },
  password: { type: String, required: true },
  birthday: { type: String },
  city: { type: String },
  country: { type: String },
  gender: { type: Number },
  name: { type: String },
  notify: { type: Object, required: true },
  coins: { type: Number, required: true },
});

export default models.User || model<User>("User", userSchema);

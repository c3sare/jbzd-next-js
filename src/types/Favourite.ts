export type Favourite = {
  _id: string;
  username: string;
  post: string;
  addTime: Date;
  type: "POST" | "COMMENT";
};

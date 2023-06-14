import { Types } from "mongoose";

interface User {
  _id: Types.ObjectId;
  username: string;
  avatar: string;
  premium: {
    memPerPage: 8 | 16 | 32;
    adminPostsOff: boolean;
    imagesGifsCommentsOff: boolean;
    adsOff: boolean;
    hideProfile: false;
    hidePremiumIconBeforeNickName: boolean;
    hideLowReputationComments: false;
  };
  premiumExpires: Date;
  userMethod?: "FOLLOW" | "BLOCK" | "";
}

export default interface Subcommentstats {
  _id: Types.ObjectId | string;
  author: string;
  post: Types.ObjectId | string;
  addTime: Date;
  text: string;
  rock: number;
  silver: number;
  gold: number;
  user?: User;
  precedent: Types.ObjectId | string | null;
  score: number;
  voteMethod?: "PLUS" | "MINUS" | "";
  isFavourite?: boolean;
}

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
}

export default interface Commentstats {
  _id: Types.ObjectId;
  author: string;
  post: Types.ObjectId;
  addTime: Date;
  text: string;
  rock: number;
  silver: number;
  gold: number;
  user?: User;
  subComments: {
    _id: Types.ObjectId;
    author: string;
    post: Types.ObjectId;
    addTime: Date;
    text: string;
    rock: number;
    silver: number;
    gold: number;
    user?: User;
    score: number;
  }[];
  score: number;
}

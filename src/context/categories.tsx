import React from "react";

interface Category {
  _id: string;
  name: string;
  nsfw: boolean;
  slug: string;
  asPage: boolean;
  color: string;
  hide: boolean;
}

export const CategoryContext = React.createContext<Category[] | null>(null);
export const CategoryReducer = React.createContext<any>(null);

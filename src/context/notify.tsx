import React from "react";

interface Notify {
  text: string;
  id: string;
  type: "Error" | "Warning" | "Info";
  closeFn: () => void;
}

export const NotifyContext = React.createContext<Notify[]>([]);
export const NotifyReducer = React.createContext<any>(null);

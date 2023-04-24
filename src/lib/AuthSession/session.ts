import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "./config";

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}

export type User = {
  logged: boolean;
  login: string;
};

export function withSessionSSR(handler: any) {
  return withIronSessionSsr(handler, sessionOptions);
}

export function withSessionAPI(handler: any) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "./config";
import type { GetServerSideProps, NextApiHandler } from "next/types";

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}

export type User = {
  logged: boolean;
  login: string;
};

export function withSessionSSR(handler: GetServerSideProps<any>) {
  return withIronSessionSsr(handler, sessionOptions);
}

export function withSessionAPI(handler: NextApiHandler<any>) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

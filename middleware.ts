import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session/edge";
import { sessionOptions } from "@/lib/AuthSession/config";

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, sessionOptions);

  const { user } = session;

  if (!user?.logged || !user.login) {
    if (user?.logged || user?.login) session.destroy();

    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
};

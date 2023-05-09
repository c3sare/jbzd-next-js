import type { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "@/lib/AuthSession/config";
import { withIronSessionApiRoute } from "iron-session/next";
import dbConnect from "@/lib/dbConnect";
import Users, { type User } from "@/models/User";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const session = req.session.user;
    if (!session?.logged) return res.status(200).json(0);

    await dbConnect();
    const user = (await Users.findOne({ username: session.login })) as User;

    if (!user) return res.status(200).json(0);

    res.status(200).json(user.coins);
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

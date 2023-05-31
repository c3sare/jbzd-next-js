import { sessionOptions } from "@/lib/AuthSession/config";
import dbConnect from "@/lib/dbConnect";
import ObservedBlockList from "@/models/ObservedBlockList";
import User from "@/models/User";
import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session.user;
  dbConnect();
  if (req.method === "GET") {
    if (!session?.logged || !session?.login)
      return res.status(400).json({ message: "Nie jesteś zalogowany!" });

    const user = await User.exists({
      username: session.login,
    });

    if (!user)
      return res.status(404).json({ message: "Nie znaleziono użytkownika!" });

    const blacklist = await ObservedBlockList.find({
      username: session.login,
    });

    const result = {
      user: {
        follow: blacklist
          .filter((item) => item.type === "USER" && item.method === "FOLLOW")
          .map((item) => item.name),
        block: blacklist
          .filter((item) => item.type === "USER" && item.method === "BLOCK")
          .map((item) => item.name),
      },
      tag: {
        follow: blacklist
          .filter((item) => item.type === "TAG" && item.method === "FOLLOW")
          .map((item) => item.name),
        block: blacklist
          .filter((item) => item.type === "TAG" && item.method === "BLOCK")
          .map((item) => item.name),
      },
      section: {
        follow: blacklist
          .filter((item) => item.type === "SECTION" && item.method === "FOLLOW")
          .map((item) => item.name),
      },
    };

    res.status(200).json(result);
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

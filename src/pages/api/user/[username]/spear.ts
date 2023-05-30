import { sessionOptions } from "@/lib/AuthSession/config";
import dbConnect from "@/lib/dbConnect";
import Badge from "@/models/Badge";
import User from "@/models/User";
import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const session = req.session?.user;

    if (!session?.logged || !session?.login)
      return res.status(403).json({ message: "Nie jesteś zalogowany!" });

    await dbConnect();

    const existLoggedUser = User.exists({ username: session.login });

    if (!existLoggedUser)
      return res
        .status(404)
        .json({ message: "Zalogowany użytkownik już nie istnieje!" });

    const username = req.query.username;

    const user = await User.findOne({ username });

    if (!user)
      return res
        .status(404)
        .json({ message: "Podany użytkownik nie istnieje!" });

    const isFollowed = await Badge.exists({
      author: session?.login,
      id: user._id,
      where: "PROFILE",
      type: "SPEAR",
    });

    if (!isFollowed) {
      const result = await Badge.collection.insertOne({
        author: session.login,
        id: user._id,
        where: "PROFILE",
        type: "SPEAR",
      });

      if (!result.acknowledged)
        return res.status(500).json({ message: "Wystąpił nieznany błąd" });
    } else {
      const result = await Badge.deleteOne({
        author: session.login,
        id: user._id,
        where: "PROFILE",
        type: "SPEAR",
      });
      if (!result.acknowledged)
        return res.status(500).json({ message: "Wystąpił nieznany błąd" });
    }

    const counter = await Badge.count({
      id: user._id,
      where: "PROFILE",
      type: "SPEAR",
    });

    res.json({ counter });
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

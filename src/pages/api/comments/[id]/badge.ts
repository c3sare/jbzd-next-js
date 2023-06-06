import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { Types } from "mongoose";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/AuthSession/config";
import Badge from "@/models/Badge";
import User from "@/models/User";
import Comment from "@/models/Comment";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session.user;
  if (req.method === "POST") {
    if (!session?.logged || !session?.login)
      return res.status(403).json({ message: "Brak dostępu do tej funkcji!" });

    const { id } = req.query;
    const { type }: { type: string } = req.body;

    const types = ["ROCK", "SILVER", "GOLD"];

    if (!id || !Types.ObjectId.isValid(id as string))
      return res
        .status(400)
        .json({ message: "Nieprawidłowy identyfikator komentarza!" });

    if (!types.includes(type || ""))
      return res.status(400).json({ message: "Nieprawidłowy typ odznaki" });

    await dbConnect();

    const user = await User.findOne({ username: session.login });

    const cost: {
      [key: string]: number;
    } = {
      ROCK: 100,
      SILVER: 400,
      GOLD: 1000,
    };

    if (cost[type] > user.coins)
      return res
        .status(400)
        .json({ message: "Nie masz wystarczającej ilości monet!" });

    const commentId = new Types.ObjectId(id as string);

    const isExist = await Comment.exists({
      _id: commentId,
    });

    if (!isExist)
      return res.status(404).json({ message: "Post nie istnieje!" });

    const checkIsBadged = await Badge.exists({
      where: "COMMENT",
      type,
      id: commentId,
      author: session.login,
    });

    if (checkIsBadged) {
      return res.status(400).json({ message: "Przyznałeś już taką odznakę!" });
    } else {
      const badge = await Badge.collection.insertOne({
        author: session.login,
        where: "COMMENT",
        type,
        id: commentId,
        addTime: new Date(),
      });

      if (!badge)
        return res
          .status(500)
          .json({ message: "Wystąpił problem przy wykonywaniu zapytania!" });

      const removeCoins = await User.updateOne(
        { username: session.login },
        { $inc: { coins: -cost[type] } }
      );

      if (!removeCoins || removeCoins?.matchedCount !== 1)
        return res.status(500).json({
          message:
            "Odznaka została dodana, lecz wystąpił problem przy odejmowaniu monet!",
        });

      const names: {
        [key: string]: string;
      } = {
        ROCK: "kamienna dzida",
        SILVER: "srebrna dzida",
        GOLD: "złota dzida",
      };

      const count = await Badge.count({
        where: "COMMENT",
        type,
        id: commentId,
      });

      res.status(200).json({
        message: "Odznaka " + names[type] + " została przyznana!",
        count,
        type,
      });
    }
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

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

    const types = ["PLUS", "MINUS"];

    if (!id || !Types.ObjectId.isValid(id as string))
      return res
        .status(400)
        .json({ message: "Nieprawidłowy identyfikator komentarza!" });

    if (!types.includes(type || ""))
      return res.status(400).json({ message: "Nieprawidłowy typ oceny" });

    await dbConnect();

    const user = await User.exists({ username: session.login });

    if (!user)
      return res
        .status(404)
        .json({ message: "Zalogowany użytkownik nie istnieje!" });

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
      const delBadge = await Badge.collection.deleteOne({
        where: "COMMENT",
        type,
        id: commentId,
        author: session.login,
      });

      if (delBadge.deletedCount !== 1)
        return res
          .status(500)
          .json({ message: "Wystąpił problem przy wykonywaniu zapytania!" });
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

      await Badge.collection.deleteOne({
        author: session.login,
        where: "COMMENT",
        id: commentId,
        type: type === "PLUS" ? "MINUS" : "PLUS",
      });
    }

    const countPlus = await Badge.count({
      where: "COMMENT",
      type: "PLUS",
      id: commentId,
    });

    const countMinus = await Badge.count({
      where: "COMMENT",
      type: "MINUS",
      id: commentId,
    });

    const count = countPlus - countMinus;

    res.status(200).json({
      message: type + " został przyznany!",
      count,
      type,
      isBadged: !checkIsBadged,
    });
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

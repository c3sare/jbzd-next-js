import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { Types } from "mongoose";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/AuthSession/config";
import Post from "@/models/Post";
import Badge from "@/models/Badge";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session.user;
  if (req.method === "POST") {
    if (!session?.logged || !session?.login)
      return res.status(403).json({ message: "Brak dostępu do tej funkcji!" });

    const { id } = req.query;

    if (!id || !Types.ObjectId.isValid(id as string))
      return res
        .status(400)
        .json({ message: "Nieprawidłowy identyfikator posta!" });

    await dbConnect();

    const postId = new Types.ObjectId(id as string);

    const isExist = await Post.exists({
      _id: postId,
    });

    if (!isExist)
      return res.status(404).json({ message: "Post nie istnieje!" });

    const checkIsPlused = await Badge.exists({
      where: "POST",
      type: "PLUS",
      id: postId,
      author: session.login,
    });

    if (checkIsPlused) {
      const unplus = await Badge.deleteOne({
        where: "POST",
        type: "PLUS",
        id: postId,
        author: session.login,
      });

      if (!unplus)
        return res
          .status(500)
          .json({ message: "Wystąpił problem przy wykonywaniu zapytania!" });

      const count = await Badge.count({
        type: "PLUS",
        where: "POST",
        id: postId,
      });

      res.status(200).json({ method: "UNPLUS", count });
    } else {
      const plus = await Badge.collection.insertOne({
        author: session.login,
        where: "POST",
        type: "PLUS",
        id: postId,
        addTime: new Date(),
      });

      if (!plus)
        return res
          .status(500)
          .json({ message: "Wystąpił problem przy wykonywaniu zapytania!" });

      const count = await Badge.count({
        type: "PLUS",
        where: "POST",
        id: postId,
      });

      res.status(200).json({ method: "PLUS", count });
    }
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

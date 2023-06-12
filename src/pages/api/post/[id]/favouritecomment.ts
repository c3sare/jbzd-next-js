import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { Types } from "mongoose";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/AuthSession/config";
import Favourite from "@/models/Favourite";
import Comment from "@/models/Comment";

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
    const isExist = await Comment.exists({
      _id: new Types.ObjectId(id as string),
    });

    if (!isExist)
      return res.status(404).json({ message: "Post nie istnieje!" });

    const checkIsFavourite = await Favourite.exists({
      post: id,
      username: session.login,
      type: "COMMENT",
    });

    if (checkIsFavourite) {
      const unLike = await Favourite.deleteOne({
        post: id,
        username: session.login,
        type: "COMMENT",
      });

      if (!unLike)
        return res
          .status(500)
          .json({ message: "Wystąpił problem przy wykonywaniu zapytania!" });

      res.status(200).json({ method: "UNLIKED" });
    } else {
      const like = await Favourite.collection.insertOne({
        username: session.login,
        post: id,
        addTime: new Date(),
        type: "COMMENT",
      });

      if (!like)
        return res
          .status(500)
          .json({ message: "Wystąpił problem przy wykonywaniu zapytania!" });

      res.status(200).json({ method: "LIKED" });
    }
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

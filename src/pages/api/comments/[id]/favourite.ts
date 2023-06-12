import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { Types } from "mongoose";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/AuthSession/config";
import User from "@/models/User";
import Comment from "@/models/Comment";
import Favourite from "@/models/Favourite";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session.user;
  if (req.method === "POST") {
    if (!session?.logged || !session?.login)
      return res.status(403).json({ message: "Brak dostępu do tej funkcji!" });

    const { id } = req.query;

    if (!id || !Types.ObjectId.isValid(id as string))
      return res
        .status(400)
        .json({ message: "Nieprawidłowy identyfikator komentarza!" });

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

    const checkIsExist = await Favourite.collection.findOne({
      username: session.login,
      post: commentId,
      type: "COMMENT",
    });
    console.log(checkIsExist);

    if (checkIsExist) {
      const delBadge = await Favourite.collection.deleteMany({
        type: "COMMENT",
        username: session.login,
        post: commentId,
      });

      if (delBadge.deletedCount !== 1)
        return res
          .status(500)
          .json({ message: "Wystąpił problem przy wykonywaniu zapytania!" });

      return res.status(200).json({ method: "UNLIKE" });
    } else {
      const addFavourite = await Favourite.collection.insertOne({
        username: session.login,
        post: commentId,
        addTime: new Date(),
        type: "COMMENT",
      });

      if (!addFavourite)
        return res
          .status(500)
          .json({ message: "Wystąpił problem przy wykonywaniu zapytania!" });

      return res.status(200).json({ method: "LIKE" });
    }
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

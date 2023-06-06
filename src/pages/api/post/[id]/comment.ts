import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { Types } from "mongoose";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/AuthSession/config";
import Post from "@/models/Post";
import Comment, { Commentstats } from "@/models/Comment";
import User from "@/models/User";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
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

    const comments = await Commentstats.find({ post: postId });

    return res.status(200).json(comments);
  } else if (req.method === "PUT") {
    const session = req.session.user;

    if (!session?.logged || !session?.login)
      return res.status(403).json({ message: "Nie jesteś zalogowany!" });

    const { id } = req.query;
    const { text, commentId } = req.body;

    if (
      !id ||
      !Types.ObjectId.isValid(id as string) ||
      (commentId !== null && !Types.ObjectId.isValid(commentId as string))
    )
      return res
        .status(400)
        .json({ message: "Nieprawidłowy identyfikator posta/komentarza!" });

    await dbConnect();

    const userExist = await User.exists({ username: session.login });

    if (!userExist)
      return res
        .status(404)
        .json({ message: "Zalogowany użytkownik nie istnieje!" });

    const postId = new Types.ObjectId(id as string);

    const isExist = await Post.exists({
      _id: postId,
    });

    if (!isExist)
      return res.status(404).json({ message: "Post nie istnieje!" });

    const precedent = commentId === null ? null : new Types.ObjectId(commentId);

    if (precedent !== null) {
      const mainComment = await Comment.exists({
        _id: precedent,
      });

      if (!mainComment)
        return res
          .status(404)
          .json({ message: "Komentarz do którego odpowiadasz nie istnieje!" });
    }

    const insertComment = await Comment.collection.insertOne({
      author: session.login,
      post: postId,
      addTime: new Date(),
      precedent: precedent,
      text,
    });

    if (!insertComment?.acknowledged)
      return res
        .status(500)
        .json({ message: "Wystąpił problem przy wykonywaniu zapytania!" });

    return res.status(200).json({ message: "Dodano prawidłowo komentarz!" });
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

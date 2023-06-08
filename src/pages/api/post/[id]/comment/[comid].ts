import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { Types } from "mongoose";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/AuthSession/config";
import Post from "@/models/Post";
import { Commentstats } from "@/models/Comment";
const ObjectId = Types.ObjectId;
const isValidObjectId = Types.ObjectId.isValid;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedMethods = ["GET"];
  if (!allowedMethods.includes(req.method as string))
    return res.status(404).json({ message: "Page not found" });

  const { id, comid } = req.query;

  if (
    !id ||
    !isValidObjectId(id as string) ||
    !comid ||
    !isValidObjectId(comid as string)
  )
    return res
      .status(400)
      .json({ message: "Nieprawidłowy identyfikator posta!" });

  await dbConnect();

  const postId = new ObjectId(id as string);
  const commentId = new ObjectId(comid as string);

  const isExist = await Post.exists({
    _id: postId,
  });

  if (!isExist)
    return res
      .status(404)
      .json({ message: "Post o wybranym id nie istnieje!" });

  if (req.method === "GET") {
    const comment = await Commentstats.findOne({
      post: postId,
      _id: commentId,
    });

    if (!comment)
      return res
        .status(404)
        .json({ message: "Komentarz o podanym id nie istnieje!" });

    return res.status(200).json(comment);
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

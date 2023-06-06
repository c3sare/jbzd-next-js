import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { Types } from "mongoose";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/AuthSession/config";
import Post from "@/models/Post";
import { Commentstats } from "@/models/Comment";

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

    const comments = await Commentstats.find({ post: postId }).sort({
      score: -1,
    });

    return res.status(200).json(comments);
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

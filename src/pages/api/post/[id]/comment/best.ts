import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { Types } from "mongoose";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/AuthSession/config";
import Post from "@/models/Post";
import { Commentstats } from "@/models/Comment";
import Badge from "@/models/Badge";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session.user;
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

    let comments = JSON.parse(
      JSON.stringify(
        await Commentstats.find({ post: postId }).sort({
          score: -1,
        })
      )
    );

    if (session?.logged && session?.login) {
      const commentIds: any[] = [];
      comments.forEach((item: any) => {
        commentIds.push(new Types.ObjectId(item._id));
        item.subcomments.forEach((subitem: any) =>
          commentIds.push(new Types.ObjectId(subitem._id))
        );
      });

      const votes = JSON.parse(
        JSON.stringify(
          await Badge.find({
            type: { $in: ["PLUS", "MINUS"] },
            where: "COMMENT",
            author: session.login,
            id: { $in: commentIds },
          })
        )
      );

      comments = comments.map((comment: any) => {
        const newComment = { ...comment };
        delete newComment.subcomments;

        return {
          ...newComment,
          subcomments: comment.subcomments.map((subitem: any) => ({
            ...subitem,
            voteType:
              votes?.find((item: any) => item.id === subitem._id)?.type || "",
          })),
          voteType:
            votes?.find((item: any) => item.id === comment._id)?.type || "",
        };
      });
    }
    return res.status(200).json(comments);
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

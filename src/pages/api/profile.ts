import type { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "@/lib/AuthSession/config";
import { withIronSessionApiRoute } from "iron-session/next";
import dbConnect from "@/lib/dbConnect";
import Users, { type User } from "@/models/User";
import Post from "@/models/Post";
import Comment from "@/models/Comment";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const session = req.session.user;
    if (!session?.logged)
      return res.status(400).json({ message: "Nie jesteś zalogowany!" });

    await dbConnect();
    const user = (await Users.findOne({ username: session.login })) as User;

    if (!user)
      return res.status(404).json({ message: "Nie odnaleziono użytkownika!" });

    const acceptedPosts = await Post.count({
      author: user.username,
      accepted: true,
    });

    const allPosts = await Post.count({ author: user.username });

    const comments = await Comment.count({ author: user.username });

    res
      .status(200)
      .json({
        avatar: user.avatar,
        createDate: user.createDate,
        allPosts,
        acceptedPosts,
        comments,
      });
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

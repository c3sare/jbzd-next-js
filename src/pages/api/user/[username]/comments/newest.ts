import Post from "@/models/Post";
import { sessionOptions } from "@/lib/AuthSession/config";
import dbConnect from "@/lib/dbConnect";
import { AllComments } from "@/models/Comment";
import User from "@/models/User";
import { withIronSessionApiRoute } from "iron-session/next";
import { Types } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import slug from "@/utils/createSlug";
import Badge from "@/models/Badge";
import ObservedBlockList from "@/models/ObservedBlockList";
import Favourite from "@/models/Favourite";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const session = req.session?.user;
    const { username } = req.query;

    await dbConnect();
    const userIsExist = await User.exists({ username });

    if (!userIsExist)
      return res
        .status(404)
        .json({ message: "Podany użytkownik nie istnieje!" });

    let findOptions: any = {
      author: username as string,
    };

    let comments = JSON.parse(
      JSON.stringify(
        await AllComments.find(findOptions).sort({
          addTime: -1,
        })
      )
    );

    const commentIds = comments.map(
      (item: any) => new Types.ObjectId(item.post)
    );

    const posts = JSON.parse(
      JSON.stringify(
        await Post.find({
          _id: { $in: commentIds },
        })
      )
    );

    comments = comments.map((item: any) => ({
      ...item,
      slug: slug(
        posts.find((post: any) => post._id === item.post)?.title || ""
      ),
    }));

    if (session?.logged && session?.login) {
      const commentIds = comments.map(
        (item: any) => new Types.ObjectId(item._id)
      );

      const userMethod = await ObservedBlockList.findOne({
        username: session.login,
        type: "USER",
        name: username,
        method: { $in: ["FOLLOW", "BLOCK"] },
      });

      const userVotes = JSON.parse(
        JSON.stringify(
          await Badge.find({
            author: session.login,
            where: "COMMENT",
            type: { $in: ["PLUS", "MINUS"] },
            id: { $in: commentIds },
          })
        )
      );

      const favourites = JSON.parse(
        JSON.stringify(
          await Favourite.find({
            username: session.login,
            type: "COMMENT",
          })
        )
      );

      comments = comments.map((item: any) => {
        const newItem = { ...item };
        delete newItem.user;

        return {
          ...item,
          user: {
            ...item.user,
            method: userMethod?.method || "",
          },
          voteType:
            userVotes?.find((vote: any) => vote.id === item._id)?.type || "",
          isFavourite: Boolean(
            favourites.find((favourite: any) => favourite.post === item._id)
          ),
        };
      });
    } else {
      comments = comments.map((item: any) => {
        const newObject = item;
        delete newObject.user;
        return newObject;
      });
    }
    res.status(200).json(comments);
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

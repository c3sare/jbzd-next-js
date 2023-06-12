import { sessionOptions } from "@/lib/AuthSession/config";
import dbConnect from "@/lib/dbConnect";
import Badge from "@/models/Badge";
import Category from "@/models/Category";
import Favourite from "@/models/Favourite";
import ObservedBlockList from "@/models/ObservedBlockList";
import { Postsstats } from "@/models/Post";
import User from "@/models/User";
import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const session = req.session?.user;
    const { username, category } = req.query;

    await dbConnect();
    const userIsExist = await User.exists({ username });

    if (!userIsExist)
      return res
        .status(404)
        .json({ message: "Podany użytkownik nie istnieje!" });

    let findOptions: any = {
      author: username as string,
    };

    if (category !== "all") {
      const categoryIsExist = await Category.exists({ slug: category });

      if (!categoryIsExist)
        return res
          .status(404)
          .json({ message: "Podana kategoria nie istnieje!" });

      findOptions.category = category;
    }

    let posts = JSON.parse(
      JSON.stringify(
        await Postsstats.find(findOptions).sort({
          addTime: -1,
        })
      )
    );

    if (session?.logged && session?.login) {
      let postUsers = posts.map((item: any) => item.author);
      postUsers = postUsers.filter(
        (item: any, pos: any) => postUsers.indexOf(item) === pos
      );
      const listOfObservedBlock = JSON.parse(
        JSON.stringify(
          await ObservedBlockList.find({
            username: session.login,
            type: "USER",
            method: { $in: ["FOLLOW", "BLOCK"] },
            name: { $in: postUsers },
          })
        )
      );

      const favourites: string[] = JSON.parse(
        JSON.stringify(
          await Favourite.find({ username: session.login, type: "POST" })
        )
      ).map((item: any) => item.post);

      const pluses: string[] = JSON.parse(
        JSON.stringify(
          await Badge.find({
            author: session.login,
            where: "POST",
            type: "PLUS",
          })
        )
      ).map((item: any) => item.id);

      posts = posts.map((item: any) => {
        item.user.method =
          listOfObservedBlock.find(
            (element: any) => element.name === item.author
          )?.method || "";
        return {
          ...item,
          isPlused: Boolean(pluses.find((pitem) => pitem === item._id)),
          isFavourite: Boolean(favourites.find((pitem) => pitem === item._id)),
        };
      });
    } else {
      posts = posts.map((item: any) => {
        const newObject = item;
        delete newObject.user;
        return newObject;
      });
    }
    res.status(200).json(posts);
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

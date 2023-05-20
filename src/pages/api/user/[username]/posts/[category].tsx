import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { Postsstats } from "@/models/Post";
import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = req.session?.user;
    const { username, category } = req.query;

    await dbConnect();
    const userIsExist = await User.exists({ username });

    if (!userIsExist)
      return res
        .status(404)
        .json({ message: "Podany użytkownik nie istnieje!" });

    if (category === "all") {
      const posts = await Postsstats.find({
        author: username as string,
      });

      res.status(200).json(posts);
    } else {
      const categoryIsExist = await Category.exists({ slug: category });

      if (!categoryIsExist)
        return res
          .status(404)
          .json({ message: "Podana kategoria nie istnieje!" });

      let posts = await Postsstats.find({
        author: username as string,
        category: category as string,
      });

      if (!session?.logged || !session?.login) {
        posts = posts.map((item) => {
          const newObject = { ...item._doc };
          delete newObject.user;
          return newObject;
        });
      }

      res.status(200).json(posts);
    }
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

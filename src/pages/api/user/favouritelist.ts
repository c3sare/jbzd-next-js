import { sessionOptions } from "@/lib/AuthSession/config";
import dbConnect from "@/lib/dbConnect";
import Favourite from "@/models/Favourite";
import User from "@/models/User";
import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session.user;
  dbConnect();
  if (req.method === "GET") {
    if (!session?.logged || !session?.login)
      return res.status(400).json({ message: "Nie jesteś zalogowany!" });

    const user = await User.exists({
      username: session.login,
    });

    if (!user)
      return res.status(404).json({ message: "Nie znaleziono użytkownika!" });

    const favourites = await Favourite.find({
      username: session.login,
      type: "POST",
    });

    res.status(200).json(favourites.map((item) => item.post.toString()));
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

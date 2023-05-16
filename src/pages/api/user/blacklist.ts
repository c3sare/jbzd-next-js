import { sessionOptions } from "@/lib/AuthSession/config";
import dbConnect from "@/lib/dbConnect";
import Blacklist from "@/models/Blacklist";
import Observelist from "@/models/Observelist";
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

    const blacklist = await Blacklist.find({
      username: session.login,
    });

    res.status(200).json(blacklist.map((item) => item.user.toString()));
  } else if (req.method === "POST") {
    if (!session?.logged || !session?.login)
      return res.status(400).json({ message: "Nie jesteś zalogowany!" });

    const user = await User.exists({
      username: session.login,
    });

    if (!user)
      return res.status(404).json({ message: "Nie znaleziono użytkownika!" });

    const { username } = req.body;

    if (!username)
      return res
        .status(404)
        .json({ message: "Nie znaleziono użytkownika do zablokowania!" });

    const userExist = await User.exists({ username });

    if (!userExist)
      return res
        .status(404)
        .json({ message: "Nie znaleziono użytkownika do zablokowania!" });

    if (username === session.login)
      return res
        .status(400)
        .json({ message: "Nie możesz zablokować samego siebie!" });

    const blacklist = await Blacklist.exists({
      username: session.login,
      user: username,
    });

    if (!blacklist) {
      const insert = await Blacklist.collection.insertOne({
        username: session.login,
        user: username,
        addTime: new Date(),
      });

      if (!insert.acknowledged)
        return res
          .status(500)
          .json({ message: "Wystąpił błąd przy wykonywaniu zapytania!" });

      Observelist.collection.deleteMany({
        username: session.login,
        user: username,
      });

      return res.status(200).json({ method: "ADD", user: username });
    } else {
      const deleteList = await Blacklist.collection.deleteOne({
        username: session.login,
        user: username,
      });

      if (!deleteList.acknowledged)
        return res
          .status(500)
          .json({ message: "Wystąpił błąd przy wykonywaniu zapytania!" });

      return res.status(200).json({ method: "ODD", user: username });
    }
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

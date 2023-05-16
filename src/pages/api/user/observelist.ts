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

    const observed = await Observelist.find({
      username: session.login,
    });

    res.status(200).json(observed.map((item) => item.user.toString()));
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
        .json({ message: "Nie znaleziono użytkownika do obserwowania!" });

    const userExist = await User.exists({ username });

    if (!userExist)
      return res
        .status(404)
        .json({ message: "Nie znaleziono użytkownika do obserwowania!" });

    if (username === session.login)
      return res
        .status(400)
        .json({ message: "Nie możesz obserwować samego siebie!" });

    const observelist = await Observelist.exists({
      username: session.login,
      user: username,
    });

    if (!observelist) {
      const insert = await Observelist.collection.insertOne({
        username: session.login,
        user: username,
        addTime: new Date(),
      });

      if (!insert.acknowledged)
        return res
          .status(500)
          .json({ message: "Wystąpił błąd przy wykonywaniu zapytania!" });

      Blacklist.collection.deleteMany({
        username: session.login,
        user: username,
      });

      return res.status(200).json({ method: "ADD", user: username });
    } else {
      const deleteList = await Observelist.collection.deleteOne({
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

import { sessionOptions } from "@/lib/AuthSession/config";
import dbConnect from "@/lib/dbConnect";
import ObservedBlockList from "@/models/ObservedBlockList";
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

    const blacklist = await ObservedBlockList.find({
      username: session.login,
      method: "BLOCK",
      type: "USER",
    });

    res.status(200).json(blacklist.map((item) => item.name.toString()));
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

    const blacklist = await ObservedBlockList.exists({
      username: session.login,
      name: username,
      type: "USER",
      method: "BLOCK",
    });

    if (!blacklist) {
      const insert = await ObservedBlockList.collection.insertOne({
        username: session.login,
        name: username,
        type: "USER",
        method: "BLOCK",
        addTime: new Date(),
      });

      if (!insert.acknowledged)
        return res
          .status(500)
          .json({ message: "Wystąpił błąd przy wykonywaniu zapytania!" });

      await ObservedBlockList.collection.deleteMany({
        username: session.login,
        name: username,
        type: "USER",
        method: "FOLLOW",
      });

      return res.status(200).json({ method: "ADD", user: username });
    } else {
      const deleteList = await ObservedBlockList.collection.deleteOne({
        username: session.login,
        name: username,
        type: "USER",
        method: "BLOCK",
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

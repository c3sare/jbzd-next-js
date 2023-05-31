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

    const method = req.query?.method as string;
    const type = req.query?.type as string;

    if (
      !["USER", "SECTION", "TAG"].includes(type.toUpperCase()) ||
      !["FOLLOW", "BLOCK"].includes(method.toUpperCase())
    )
      return res
        .status(400)
        .json({ message: "Nieprawidłowe parametry zapytania!" });

    const user = await User.exists({
      username: session.login,
    });

    if (!user)
      return res.status(404).json({ message: "Nie znaleziono użytkownika!" });

    const blacklist = await ObservedBlockList.find({
      username: session.login,
      method,
      type,
    });

    res.status(200).json(blacklist.map((item) => item.name.toString()));
  } else if (req.method === "POST") {
    if (!session?.logged || !session?.login)
      return res.status(400).json({ message: "Nie jesteś zalogowany!" });

    const method = (req.query?.method as string).toUpperCase();
    const type = (req.query?.type as string).toUpperCase();

    if (
      !["USER", "SECTION", "TAG"].includes(type) ||
      !["FOLLOW", "BLOCK"].includes(method)
    )
      return res
        .status(400)
        .json({ message: "Nieprawidłowe parametry zapytania!" });

    const user = await User.exists({
      username: session.login,
    });

    if (!user)
      return res.status(404).json({ message: "Nie znaleziono użytkownika!" });

    const { name } = req.body;

    if (!name)
      return res
        .status(404)
        .json({ message: "Nie znaleziono użytkownika/tagu/działu!" });

    if (type === "USER") {
      if (name === session.login)
        return res
          .status(400)
          .json({ message: "Nie możesz zablokować samego siebie!" });

      const userExist = await User.exists({ username: name });

      if (!userExist)
        return res
          .status(404)
          .json({ message: "Nie znaleziono użytkownika/tagu/działu!" });
    }

    const blacklist = await ObservedBlockList.exists({
      username: session.login,
      name,
      type,
      method,
    });

    if (!blacklist) {
      const insert = await ObservedBlockList.collection.insertOne({
        username: session.login,
        name,
        type,
        method,
        addTime: new Date(),
      });

      if (!insert.acknowledged)
        return res
          .status(500)
          .json({ message: "Wystąpił błąd przy wykonywaniu zapytania!" });

      await ObservedBlockList.collection.deleteMany({
        username: session.login,
        name,
        type,
        method: method === "FOLLOW" ? "BLOCK" : "FOLLOW",
      });

      return res.status(200).json({ method: "ADD", user: name });
    } else {
      const deleteList = await ObservedBlockList.collection.deleteOne({
        username: session.login,
        name,
        type,
        method,
      });

      if (!deleteList.acknowledged)
        return res
          .status(500)
          .json({ message: "Wystąpił błąd przy wykonywaniu zapytania!" });

      return res.status(200).json({ method: "ODD", user: name });
    }
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

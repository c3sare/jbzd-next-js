import { sessionOptions } from "@/lib/AuthSession/config";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session.user;
  dbConnect();
  if (req.method === "GET") {
    if (!session?.logged || !session?.login)
      return res.status(400).json({ message: "Nie jesteś zalogowany!" });

    const user = await User.findOne({
      username: session.login,
    });

    if (!user)
      return res.status(404).json({ message: "Nie znaleziono użytkownika!" });

    const { notify } = user;
    res.status(200).json(notify);
  } else if (req.method === "POST") {
    if (!session?.logged || !session?.login)
      return res.status(400).json({ message: "Nie jesteś zalogowany!" });

    const fieldsKeys = Object.keys(req.body);

    if (
      fieldsKeys.length !== 4 ||
      !fieldsKeys.includes("commentsOnMain") ||
      !fieldsKeys.includes("newComments") ||
      !fieldsKeys.includes("newOrders") ||
      !fieldsKeys.includes("pins")
    )
      return res
        .status(400)
        .json({ message: "Nieprawidłowe parametry zapytania!" });

    const { commentsOnMain, newComments, newOrders, pins } = req.body;

    if (
      !(typeof commentsOnMain === "boolean") ||
      !(typeof newComments === "boolean") ||
      !(typeof newOrders === "boolean") ||
      !(typeof pins === "boolean")
    )
      return res.status(400).json({ message: "Niewłaściwy typ pola!" });

    const userExists = await User.exists({ username: session.login });

    if (!userExists)
      return res.status(404).json({ message: "Konto nie istnieje!" });

    const updateNotifications = await User.updateOne(
      { username: session.login },
      {
        $set: {
          notify: {
            commentsOnMain,
            newComments,
            newOrders,
            pins,
          },
        },
      }
    );

    if (updateNotifications.matchedCount !== 1)
      return res
        .status(500)
        .json({ message: "Nie udało się wykonać zapytania!" });

    return res
      .status(200)
      .json({ message: "Dane zostały poprawnie zmienione!" });
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { sessionOptions } from "@/lib/AuthSession/config";
import { withIronSessionApiRoute } from "iron-session/next";

const userNameRegex = /[a-z]?(.|\-)+(\w+|\b)/;
const emailRegex =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method === "POST") {
    const { login, password } = req.body;

    if (!login || !password)
      return res
        .status(400)
        .json({ message: "Nieprawidłowe parametry zapytania!" });

    if (!userNameRegex.test(login) && !emailRegex.test(login))
      return res
        .status(404)
        .json({ message: "Wprwadzone dane są nieprawidłowe!" });

    const searchParams =
      login.indexOf("@") > -1 ? { email: login } : { username: login };
    const find = await User.findOne(searchParams);

    if (!find)
      return res.status(404).json({ message: "Nie znaleziono takiego konta!" });

    if (find.confirmed)
      return res.status(500).json({
        message: "Konto nie zostało potwierdzone przez adres e-mail!",
      });

    const comparePWD = await bcrypt.compare(password, find.password);

    if (!comparePWD)
      return res
        .status(403)
        .json({ message: "Dane logowania są nieprawidłowe!" });

    req.session.user = {
      logged: true,
      login: find.username,
    };

    await req.session.save();
    return res.status(200).json(req.session.user);
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

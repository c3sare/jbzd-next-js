import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import sendMail from "@/utils/sendMail";
import { uniqueId } from "@/utils/uniqueId";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  if (req.method === "POST") {
    const { email } = req.body;

    const token = uniqueId().slice(0, 18).toUpperCase();
    const find = await User.collection.updateOne(
      {
        email,
        confirmed: true,
      },
      {
        $set: {
          token,
        },
      }
    );

    if (find.modifiedCount) {
      sendMail(
        email,
        "Token zmiany hasła",
        `Witaj! \n
            \n
            Otrzymujesz ten email poniewaz nastapiła próba zmiany Twojego hasła. \n \n
            Twój token potwierdzający to: ${token} \n \n
            Jeżeli to nie Ty, zignoruj ten email \n \n
            Dziękujemy, \n
            Jbzdy
            `
      );
      return res
        .status(200)
        .json({ message: "Wysłano token na adres e-mail!" });
    } else {
      return res.status(400).json({ message: "Nie można stworzyć tokenu!" });
    }
  } else if (req.method === "PUT") {
    const { token, password, repassword } = req.body;

    if (!token || !password || !repassword)
      return res
        .status(400)
        .json({ message: "Nieprawidłowe parametry zapytania!" });

    if (
      token.length !== 18 ||
      !pwdRegex.test(password) ||
      !pwdRegex.test(repassword) ||
      password !== repassword
    )
      return res
        .status(400)
        .json({ message: "Nieprawidłowo uzupełnione pola formularza!" });

    const genPassword = bcrypt.hashSync(password, 10);

    const find = await User.collection.updateOne(
      { token },
      { $set: { password: genPassword, token: "" } }
    );

    if (!find.matchedCount)
      return res.status(404).json({
        message: "Nie znaleziono użytkownika z podanym identyfiaktorem",
      });

    res.status(200).json({ message: "Hasło zostało zmienione!" });
  }
}

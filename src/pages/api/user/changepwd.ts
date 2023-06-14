import { sessionOptions } from "@/lib/AuthSession/config";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session.user;
  dbConnect();
  if (req.method === "POST") {
    if (!session?.logged || !session?.login)
      return res.status(400).json({ message: "Nie jesteś zalogowany!" });

    const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    const { currentPassword, newPassword, reNewPassword } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !reNewPassword ||
      !pwdRegex.test(currentPassword) ||
      !pwdRegex.test(newPassword) ||
      !pwdRegex.test(reNewPassword) ||
      newPassword !== reNewPassword
    )
      return res
        .status(400)
        .json({ message: "Nieprawidłowe parametry zapytania!" });

    const user = await User.findOne({
      username: session.login,
    });

    if (!user)
      return res.status(404).json({ message: "Nie znaleziono użytkownika!" });

    const comparePWD = await bcrypt.compare(currentPassword, user.password);

    if (!comparePWD)
      return res
        .status(400)
        .json({ message: "Aktualne hasło jest nieprawidłowe!" });

    const genPassword = bcrypt.hashSync(newPassword, 10);

    const updateUser = await User.updateOne(
      { username: session.login },
      {
        $set: {
          password: genPassword,
        },
      }
    );

    if (updateUser.matchedCount !== 1)
      return res.status(500).json({ message: "Hasło nie zostało zmienione!" });

    res.status(200).json({ message: "Hasło zostało zmienione pomyślnie!" });
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

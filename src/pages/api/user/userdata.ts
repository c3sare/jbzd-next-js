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

    const { name, gender, country, city, birthday } = user;
    res.status(200).json({
      name,
      gender,
      country,
      city,
      birthday,
    });
  } else if (req.method === "POST") {
    if (!session?.logged || !session?.login)
      return res.status(400).json({ message: "Nie jesteś zalogowany!" });

    const nameRegex =
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+$/u;
    const countryCityRegex =
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    const birthdayRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

    const { name, gender, country, city, birthday } = req.body;

    if (
      (name !== "" && !nameRegex.test(name)) ||
      (typeof gender === "number" && gender < 0) ||
      (typeof gender === "number" && gender > 3) ||
      (country !== "" && !countryCityRegex.test(country)) ||
      (city !== "" && !countryCityRegex.test(city)) ||
      (birthday !== "" && !birthdayRegex.test(birthday))
    )
      return res
        .status(400)
        .json({ message: "Nieprawidłowe parametry zapytania!" });

    const user = await User.findOne({
      username: session.login,
    });

    if (!user)
      return res.status(404).json({ message: "Nie znaleziono użytkownika!" });

    const updateUser = await User.updateOne(
      { username: session.login },
      {
        $set: {
          name,
          gender,
          country,
          city,
          birthday,
        },
      }
    );

    if (updateUser.matchedCount !== 1)
      return res.status(500).json({ message: "Dane nie zostały zmienione!" });

    res.status(200).json({ message: "Dane zostały zmienione pomyślnie!" });
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

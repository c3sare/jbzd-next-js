import { sessionOptions } from "@/lib/AuthSession/config";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { isPremiumUser } from "@/utils/premium";
import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session.user;
  dbConnect();
  if (req.method === "GET") {
    if (!session?.logged || !session?.login)
      return res.status(400).json({ message: "Nie jesteś zalogowany!" });

    const user = JSON.parse(
      JSON.stringify(
        await User.findOne({
          username: session.login,
        })
      )
    );

    if (!user)
      return res.status(404).json({ message: "Nie znaleziono użytkownika!" });

    console.log(user.premiumExpires);
    const isPremium = isPremiumUser(user.premiumExpires);
    const premium = user.premium;

    res.status(200).json({
      isPremium,
      ...(isPremium
        ? {
            premium,
          }
        : {}),
    });
  } else if (req.method === "POST") {
    if (!session?.logged || !session?.login)
      return res.status(400).json({ message: "Nie jesteś zalogowany!" });

    const {
      memPerPage,
      adminPostsOff,
      imagesGifsCommentsOff,
      hideMinusedComments,
      adsOff,
      hideProfile,
      hidePremiumIconBeforeNickName,
      hideLowReputationComments,
    } = req.body;

    if (
      ![8, 16, 32].includes(memPerPage) ||
      !(typeof memPerPage === "number") ||
      !(typeof adminPostsOff === "boolean") ||
      !(typeof imagesGifsCommentsOff === "boolean") ||
      !(typeof hideMinusedComments === "boolean") ||
      !(typeof adsOff === "boolean") ||
      !(typeof hideProfile === "boolean") ||
      !(typeof hidePremiumIconBeforeNickName === "boolean") ||
      !(typeof hideLowReputationComments === "boolean")
    )
      return res
        .status(400)
        .json({ message: "Niewłaściwe parametry zapytania" });

    const premium = {
      memPerPage,
      adminPostsOff,
      imagesGifsCommentsOff,
      hideMinusedComments,
      adsOff,
      hideProfile,
      hidePremiumIconBeforeNickName,
      hideLowReputationComments,
    };

    const user = JSON.parse(
      JSON.stringify(await User.findOne({ username: session.login }))
    );

    if (!user)
      return res.status(404).json({ message: "Taki użytkownik nie istnieje!" });

    if (!isPremiumUser(user.premiumExpires))
      return res
        .status(403)
        .json({ message: "Nie jesteś użytkownikiem premium!" });

    const updateUser = await User.collection.updateOne(
      { username: session.login },
      {
        $set: {
          premium,
        },
      }
    );
    console.log(updateUser);

    if (updateUser?.modifiedCount !== 1)
      return res
        .status(500)
        .json({ message: "Wystąpił błąd przy aktualizacji użytkownika!" });

    return res
      .status(200)
      .json({ message: "Prawidłowo zmieniono ustawienia!" });
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

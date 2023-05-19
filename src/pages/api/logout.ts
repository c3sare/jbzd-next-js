import { sessionOptions } from "@/lib/AuthSession/config";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next/types";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const session = req.session.user;
    if (!session?.logged && (session?.login === "" || !session?.login))
      return res.status(400).json({
        message:
          "Wystąpił problem z wylogowaniem, prawdopodobnie sesja już nie istnieje!",
      });

    req.session.destroy();
    return res.status(200).json({ logout: true });
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

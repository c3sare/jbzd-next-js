import type { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "@/lib/AuthSession/config";
import { withIronSessionApiRoute } from "iron-session/next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const session = req.session.user;
    if (!session?.logged)
      return res.status(400).json({ message: "Nie jesteś zalogowany!" } as any);

    req.session.destroy();
    res.status(200).json({ logged: false, login: "" });
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

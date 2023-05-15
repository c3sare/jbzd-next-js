import type { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "@/lib/AuthSession/config";
import { withIronSessionApiRoute } from "iron-session/next";
import dbConnect from "@/lib/dbConnect";
import { Usersprofiles } from "@/models/User";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const session = req.session.user;
    if (!session?.logged)
      return res.status(400).json({ message: "Nie jesteś zalogowany!" });

    await dbConnect();
    const user = await Usersprofiles.findOne({ username: session.login });

    if (!user)
      return res.status(404).json({ message: "Nie odnaleziono użytkownika!" });

    const data = JSON.parse(JSON.stringify(user));

    return res.status(200).json({
      avatar: data.avatar,
      createDate: data.createDate,
      allPosts: data.allPosts,
      acceptedPosts: data.acceptedPosts,
      comments: data.comments,
    });
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

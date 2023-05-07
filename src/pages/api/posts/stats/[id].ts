import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { Types } from "mongoose";
import getHomePagePostStats from "@/utils/getPostStatsHome";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/AuthSession/config";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session.user;
  const { id } = req.query;

  if (!id || !Types.ObjectId.isValid(id as string))
    return res
      .status(400)
      .json({ message: "Nieprawidłowy identyfikator posta!" });

  await dbConnect();
  const data = await getHomePagePostStats(
    id as string,
    session || { login: "", logged: false }
  );

  res.json(data);
}

export default withIronSessionApiRoute(handler, sessionOptions);

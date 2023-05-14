import dbConnect from "@/lib/dbConnect";
import { Postsstats } from "@/models/Post";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const data = await Postsstats.find({});

  res.json(data);
}

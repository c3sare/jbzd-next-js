import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const data = await Category.find({});

  res.json(data);
}

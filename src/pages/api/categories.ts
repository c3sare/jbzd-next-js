import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  videoExist: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.json({});
}

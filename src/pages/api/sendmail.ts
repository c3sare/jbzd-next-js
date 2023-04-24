import sendMail from "@/utils/sendMail";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  sendMail("cesare212@gmail.com", "test", "Testowa wiadomość");

  res.json({});
}

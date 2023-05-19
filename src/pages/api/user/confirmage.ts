import { sessionOptions } from "@/lib/AuthSession/config";
import dbConnect from "@/lib/dbConnect";
import { setCookie } from "cookies-next";
import { compareAsc, format } from "date-fns";
import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session.user;
  dbConnect();
  if (req.method === "POST") {
    if (!session?.logged || !session?.login)
      return res.status(404).json({ message: "Nie jesteś zalogowany!" });

    const { date } = req.body;
    const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
    if (!date || !dateRegex.test(date))
      return res.status(400).json({ message: "Nieprawidłowa data!" });

    const curDate = new Date();
    curDate.setFullYear(curDate.getFullYear() - 18);
    const dateArr = date.split("-");
    const compare = compareAsc(
      curDate,
      new Date(Number(dateArr[0]), Number(dateArr[1]), Number(dateArr[2]))
    );
    if ([0, -1].includes(compare))
      return res.status(403).json({ message: "Nie jesteś pełnoletni!" });

    setCookie("ofage", "on", { req, res });
    return res.status(200).json({ ofage: true });
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

import type { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "@/lib/AuthSession/config";
import { withIronSessionApiRoute } from "iron-session/next";
import { v2 as cloudinary } from "cloudinary";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session.user;
  await dbConnect();
  if (req.method === "GET") {
    if (!session?.logged)
      return res.status(400).json({ message: "Nie jesteś zalogowany!" });

    const user = await User.findOne({ username: session.login });

    if (!user)
      return res
        .status(404)
        .json({ message: "Nie odnaleziono takiego użytkownika" });

    return res.status(200).json({
      avatar: user.avatar === "" ? "/images/avatars/default.jpg" : user.avatar,
    });
  } else if (req.method === "POST") {
    if (!session?.logged)
      return res.status(400).json({ message: "Nie jesteś zalogowany!" });

    const { avatar } = req.body;

    const base64RegExp =
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
    const isBase64 = (str: string) => base64RegExp.test(str);

    if (!avatar || !isBase64(avatar.replace("data:image/png;base64,", "")))
      return res
        .status(400)
        .json({ message: "Nieprawidłowe parametry zapytania!" });

    cloudinary.config({
      secure: true,
    });

    const options = {
      unique_filename: true,
      overwrite: true,
      folder: "upload/avatars",
    };

    const result = await cloudinary.uploader.upload(
      req.body.avatar,
      options as any
    );

    console.log(result);
    if (!result)
      return res
        .status(500)
        .json({ message: "Wystąpił błąd przy zmianie avatara!" });

    const user = await User.findOne({ username: session.login });

    if (!user)
      return res.status(404).json({ message: "Nie odnaleziono użytkownika!" });

    if (user.avatar !== "") {
      const url = user.avatar;
      const id = url.slice(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
      cloudinary.uploader.destroy(options.folder + "/" + id, {});
    }

    const updateUser = await User.updateOne(
      { username: session.login },
      { $set: { avatar: result.secure_url } }
    );

    if (!updateUser || updateUser.matchedCount !== 1)
      return res
        .status(500)
        .json({ message: "Wystąpił błąd przy wykonywaniu zapytania!" });

    res.status(200).json({ message: "Prawidłowo zmieniono avatar!" });
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

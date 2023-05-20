import type { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "@/lib/AuthSession/config";
import { withIronSessionApiRoute } from "iron-session/next";
import { v2 as cloudinary } from "cloudinary";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import Favourite from "@/models/Favourite";
import Badge from "@/models/Badge";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session.user;
  await dbConnect();
  if (req.method === "POST") {
    if (!session?.logged)
      return res.status(400).json({ message: "Nie jesteś zalogowany!" });

    const user = await User.findOne({ username: session.login });

    if (!user)
      return res.status(404).json({ message: "Takie konto już nie istnieje!" });

    const posts = await Post.collection.find({ author: session.login });
    const deletePosts = await Post.deleteMany({ author: session.login });

    let cloudVideos: any[] = [];
    let cloudImages: any[] = [];

    posts.forEach((item) => {
      const toAddVideos = item.memContainers.filter((mem: any) =>
        ["video"].includes(mem.type)
      );
      const toAddImages = item.memContainers.filter((mem: any) =>
        ["image"].includes(mem.type)
      );
      cloudVideos = [...cloudVideos, ...toAddVideos];
      cloudImages = [...cloudImages, ...toAddImages];
    });

    cloudVideos = cloudVideos.map((item) => {
      const name = item.data;
      const id = name.slice(name.lastIndexOf("/") + 1, name.lastIndex);

      return "upload/videos/" + id;
    });

    cloudImages = cloudImages.map((item) => {
      const name = item.data;
      const id = name.slice(name.lastIndexOf("/") + 1, name.lastIndex);

      return "upload/images/" + id;
    });

    cloudinary.config({
      secure: true,
    });

    await cloudinary.api.delete_resources([...cloudVideos, ...cloudImages]);

    const comments = await Comment.find({ author: session.login });

    const subcomments = comments
      .filter((item) => item.precedent === "")
      .map((item) => item._id.toString());

    await Comment.deleteMany({
      precedent: { $in: subcomments },
    });

    await Comment.deleteMany({ author: session.login });

    await Favourite.deleteMany({
      username: session.login,
    });

    await Badge.deleteMany({ username: session.login });

    req.session.destroy();

    return res
      .status(200)
      .json({ message: "Konto zostało pomyślnie usunięte!" });
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

import type { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "@/lib/AuthSession/config";
import { withIronSessionApiRoute } from "iron-session/next";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import Post from "@/models/Post";
import { Types } from "mongoose";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session.user;
  if (req.method === "POST") {
    if (!session?.logged)
      return res.status(400).json({ message: "Nie jesteś zalogowany!" });

    const data: any = await new Promise(function (resolve, reject) {
      const form = new formidable.IncomingForm({ keepExtensions: true });
      form.parse(req, function (err: any, fields: any, files: any) {
        if (err) return reject(err);
        resolve({ ...fields, files });
      });
    });

    const resultOfString: any = {
      true: true,
      false: false,
    };

    let dataToInsert: any = {
      title: data.title,
      category: data.category,
      linking: resultOfString[data.linking],
      tags: JSON.parse(data.tags),
      memContainers: JSON.parse(data.memContainers),
    };

    if (dataToInsert.linking) {
      dataToInsert.linkingUrl = data.linkingUrl;
    }

    const fileNames = Object.keys(data.files);

    cloudinary.config({
      secure: true,
    });

    const dataTypes: any = {
      image: "images",
      video: "videos",
    };

    let error = false;

    for (let i = 0; i < fileNames.length; i++) {
      const fileDataType = data.files[fileNames[i]].mimetype;
      const filePath = data.files[fileNames[i]].filepath;
      const shortType = fileDataType.slice(0, fileDataType.indexOf("/"));

      const options = {
        ...(shortType === "video" ? { resource_type: "video" } : {}),
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        ...(fileDataType === "image/gif" ? { format: "mp4" } : {}),
        folder: "upload/" + dataTypes[shortType],
      };

      const result = await cloudinary.uploader.upload(filePath, options as any);

      if (!result) {
        error = true;
        break;
      }

      const index = fileNames[i].slice(fileNames[i].indexOf("_") + 1);
      if (fileDataType === "image/gif") {
        dataToInsert.memContainers[index].type = "gif";
      }
      dataToInsert.memContainers[index].data = result.secure_url;
    }

    if (error) return res.status(400).json({ message: "Wystąpił problem!" });

    const insert = await Post.collection.insertOne({
      title: data.title,
      addTime: new Date(),
      author: session.login,
      category: data.category,
      memContainers: dataToInsert.memContainers,
      accepted: false,
      tags: JSON.parse(data.tags),
    });

    if (!insert)
      return res
        .status(400)
        .json({ message: "Nie udało się wykonać zapytania!" });

    return res.status(200).json({ message: "Prawidłowo dodano dzidę!" });
  } else if (req.method === "DELETE") {
    if (!session?.logged || !session?.login)
      return res.status(403).json({ message: "Nie jesteś zalogowany!" });

    const { id } = req.body;

    if (!id || Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ message: "Nieprawidłowe parametry zapytania!" });

    const _id = new Types.ObjectId(id);

    const post = await Post.exists({ _id, author: session.login });

    if (!post)
      return res.status(404).json({ message: "Taki post nie istnieje!" });

    const deletePost = await Post.deleteOne({ _id });

    if (deletePost.deletedCount !== 1)
      return res.status(500).json({ message: "Nie można usunąć tego posta!" });

    return res.status(200).json({ message: "Pomyślnie usunięto post!" });
  } else {
    res.status(404).json({ message: "Page not found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);

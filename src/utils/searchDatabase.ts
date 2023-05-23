import Post from "@/models/Post";
import User from "@/models/User";

interface BoxInterface {
  type: "obrazki" | "tagi" | "uzytkownicy";
  data: any[];
}

export default async function searchDatabase(
  type: "wszystko" | "obrazki" | "tagi" | "uzytkownicy",
  pharse: string
) {
  let boxes = {};

  if (["wszystko", "obrazki"].includes(type)) {
    const posts = await Post.find({
      title: {
        $regex: pharse,
        $options: "i",
      },
    });
    boxes = {
      ...boxes,
      obrazki: posts,
    };
  }

  if (["wszystko", "tagi"].includes(type)) {
    boxes = {
      ...boxes,
      tagi: [],
    };
  }

  if (["wszystko", "uzytkownicy"].includes(type)) {
    const users = await User.find({
      username: {
        $regex: pharse,
        $options: "i",
      },
    });
    boxes = {
      ...boxes,
      uzytkownicy: users.map((item) => ({
        _id: item._id,
        username: item.username,
        avatar: item.avatar,
      })),
    };
  }

  return boxes;
}

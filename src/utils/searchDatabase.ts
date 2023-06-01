import Post from "@/models/Post";
import User from "@/models/User";

function removeDuplicates(array: string[]) {
  let uniqueChars: string[] = [];
  array.forEach((element) => {
    if (!uniqueChars.includes(element)) {
      uniqueChars.push(element);
    }
  });
  return uniqueChars;
}

export default async function searchDatabase(
  type: "wszystko" | "obrazki" | "tagi" | "uzytkownicy",
  pharse: string
) {
  let boxes = {};

  pharse = decodeURIComponent(pharse);

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
    let tagi: string[] = [];
    (await Post.find({ tags: { $in: pharse.split(" ") } })).forEach(
      (item: any) => {
        tagi = [...tagi, ...item.tags];
      }
    );
    tagi = removeDuplicates(tagi);
    boxes = {
      ...boxes,
      tagi,
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

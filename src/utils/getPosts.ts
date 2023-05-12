import Badge from "@/models/Badge";
import Post from "@/models/Post";
import User from "@/models/User";

export default async function getPosts({
  accepted,
  category,
  userdetails,
  username,
}: {
  accepted?: boolean;
  category?: string;
  userdetails?: boolean;
  username?: string;
}) {
  const posts = await Post.collection
    .find({
      ...(accepted !== undefined ? { accepted } : {}),
      ...(category ? { category } : {}),
      ...(username ? { author: username } : {}),
    })
    .sort("addTime", -1)
    .toArray();

  if (userdetails) {
    const postsAuthors = posts.map((item) => item.author);

    const users = await User.find({ username: { $in: postsAuthors } });

    const data = Promise.all(
      posts.map(async (post) => {
        const user = users.find((item) => item.username === post.author);
        const spears = await Badge.count({
          where: "PROFILE",
          type: "SPEAR",
          id: user._id.toString(),
        });
        post.author = {
          username: user.username,
          avatar: user.avatar,
          spears,
        };
        return post;
      })
    );

    return data;
  } else {
    return posts;
  }
}

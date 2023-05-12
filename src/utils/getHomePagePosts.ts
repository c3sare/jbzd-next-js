import Post from "@/models/Post";
import User from "@/models/User";

export default async function getHomePagePosts() {
  const posts = await Post.collection
    .find({ accepted: true })
    .sort("addTime", -1)
    .toArray();

  const postsAuthors = posts.map((item) => item.author);

  const users = await User.find({ username: { $in: postsAuthors } });

  const data = posts.map((post) => {
    const user = users.find((item) => item.username === post.author);
    post.author = {
      username: user.username,
      avatar: user.avatar,
      spears: user.spears,
    };
    return post;
  });

  return data;
}

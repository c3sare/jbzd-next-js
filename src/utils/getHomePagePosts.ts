import Post from "@/models/Post";

export default async function getHomePagePosts() {
  const data = await Post.collection
    .find({ accepted: true })
    .sort("addTime", -1)
    .toArray();

  return data;
}

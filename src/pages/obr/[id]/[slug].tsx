import Post from "@/components/Post";
import Badge from "@/models/Badge";
import Posts from "@/models/Post";
import User from "@/models/User";
import createSlug from "@/utils/createSlug";
import { Types } from "mongoose";

const Index = ({ post }: any) => {
  return <Post post={post} />;
};

export default Index;

export async function getServerSideProps({ query }: any) {
  const { id, slug } = query;

  const post = await Posts.collection.findOne({ _id: new Types.ObjectId(id) });

  if (!post)
    return {
      notFound: true,
    };

  const slugDB = createSlug(post.title);

  if (slug !== slugDB)
    return {
      redirect: { destination: `/obr/${id}/${slugDB}`, permament: false },
    };

  const user = await User.findOne({ username: post.author });

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

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
  };
}

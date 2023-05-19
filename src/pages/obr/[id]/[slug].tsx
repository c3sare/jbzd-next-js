import Post from "@/components/Post";
import { Postsstats } from "@/models/Post";
import createSlug from "@/utils/createSlug";
import { Types } from "mongoose";

const Index = ({ post }: any) => {
  return <Post post={post} />;
};

export default Index;

export async function getServerSideProps({ query }: any) {
  const { id, slug } = query;

  const post = await Postsstats.findOne({ _id: new Types.ObjectId(id) });

  if (!post)
    return {
      notFound: true,
    };

  const slugDB = createSlug(post.title);

  if (slug !== slugDB)
    return {
      redirect: { destination: `/obr/${id}/${slugDB}`, permament: false },
    };

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
  };
}

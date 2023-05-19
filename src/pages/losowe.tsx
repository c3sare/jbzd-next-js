import Post from "@/components/Post";
import { Postsstats } from "@/models/Post";

const RandomMem = ({ post }: any) => {
  return <Post post={post} single />;
};

export default RandomMem;

export async function getServerSideProps() {
  const post = await Postsstats.aggregate([{ $sample: { size: 1 } }]);
  return {
    props: {
      post: JSON.parse(JSON.stringify(post[0])),
    },
  };
}

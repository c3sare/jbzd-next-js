import style from "@/styles/posts.module.css";
import Post from "@/components/Post";
import dbConnect from "@/lib/dbConnect";
import { Postsstats } from "@/models/Post";

const Waitings = ({ posts }: any) => {
  return (
    <div className={style.posts}>
      {posts.map((postMain: any, i: number) => (
        <Post key={i} post={postMain} />
      ))}
    </div>
  );
};

export default Waitings;

export async function getServerSideProps() {
  await dbConnect();
  const posts = await Postsstats.find({ accepted: false }).sort({
    createDate: -1,
  });

  return { props: { posts: JSON.parse(JSON.stringify(posts)) } };
}

import style from "@/styles/posts.module.css";
import Post from "@/components/Post";
import dbConnect from "@/lib/dbConnect";
import getPosts from "@/utils/getPosts";

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
  const posts = await getPosts({ accepted: false, userdetails: true });

  return { props: { posts: JSON.parse(JSON.stringify(posts)) } };
}

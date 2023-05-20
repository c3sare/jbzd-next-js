import Post from "@/components/Post";
import { Postsstats } from "@/models/Post";
import createSlug from "@/utils/createSlug";
import { Types } from "mongoose";
import Head from "next/head";
import Link from "next/link";
import style from "@/styles/posts.module.css";
import { GiDiceSixFacesTwo } from "react-icons/gi";

const Index = ({ post }: any) => {
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <Post post={post} single />
      <div className={style.pagination}>
        <div className={style.paginationButtons}>
          <Link href="/" className={style.paginationNext}>
            Przejdź na stronę główną
          </Link>
          <Link href="/losowe" className={style.paginationRandom}>
            <GiDiceSixFacesTwo />
          </Link>
        </div>
      </div>
    </>
  );
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

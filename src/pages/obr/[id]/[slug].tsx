import Post from "@/components/Post";
import { Postsstats } from "@/models/Post";
import createSlug from "@/utils/createSlug";
import { Types } from "mongoose";
import Link from "next/link";
import style from "@/styles/posts.module.css";
import { GiDiceSixFacesTwo } from "react-icons/gi";
import Seo from "@/components/Seo";
import Breadcrumb from "@/components/Breadcrumb";
import { useContext } from "react";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import Comments from "@/components/Comments";

const Index = ({ post }: any) => {
  const { categories } = useContext(GlobalContext) as GlobalContextInterface;
  console.log(categories);

  const category =
    post.category !== "" && post.category
      ? categories.find((item) => item.slug === post.category)?.name
      : "";
  return (
    <>
      <Seo title={post.title} />
      <Breadcrumb currentNode={post.title}>
        <Link href="/">Strona Główna</Link>
        {post.category.length > 0 ? (
          <Link href={`/kategoria/${post.category}`}>{category}</Link>
        ) : null}
      </Breadcrumb>
      <Post post={post} single showTags />
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
      <Comments commentsCount={post.comments} id={post._id} />
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

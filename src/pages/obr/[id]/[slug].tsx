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
import CommentForm from "@/components/CommentForm";
import dbConnect from "@/lib/dbConnect";
import { mutate } from "swr";
import Badge from "@/models/Badge";
import { withIronSessionSsr } from "iron-session/next/dist";
import { sessionOptions } from "@/lib/AuthSession/config";
import { withSessionSSR } from "@/lib/AuthSession/session";
import Favourite from "@/models/Favourite";
import ObservedBlockList from "@/models/ObservedBlockList";

const Index = ({ post }: any) => {
  const { categories } = useContext(GlobalContext) as GlobalContextInterface;

  const category =
    post.category !== "" && post.category
      ? categories.find((item) => item.slug === post.category)?.name
      : "";

  const refreshComments = () => mutate(`/api/post/${post._id}/comment`);
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
      <CommentForm
        noFocus
        endFunction={() => null}
        refreshComments={refreshComments}
        comment=""
        avatar={post.user.avatar}
        postId={post._id}
      />
      <Comments commentsCount={post.comments} id={post._id} />
    </>
  );
};

export default Index;

export const getServerSideProps = withSessionSSR(
  async function getServerSideProps({ query, req }): Promise<any> {
    const session = req.session.user;
    const { id, slug } = query;
    await dbConnect();
    let post = JSON.parse(
      JSON.stringify(
        await Postsstats.findOne({
          _id: new Types.ObjectId(id as string),
        })
      )
    );

    if (!post)
      return {
        notFound: true,
      };

    const slugDB = createSlug(post.title);

    if (slug !== slugDB)
      return {
        redirect: { destination: `/obr/${id}/${slugDB}`, permament: false },
      };

    if (session?.logged && session?.login) {
      const postId = new Types.ObjectId(post._id);
      const isPlused = await Badge.exists({
        author: session.login,
        where: "POST",
        type: "PLUS",
        id: postId,
      });
      const isFavourite = await Favourite.exists({
        username: session.login,
        post: postId,
      });
      const userMethod = await ObservedBlockList.findOne({
        username: session.login,
        type: "USER",
        method: { $in: ["FOLLOW", "BLOCK"] },
        name: post.author,
      });
      const userTags = await ObservedBlockList.find({
        username: session.login,
        type: "TAG",
        name: { $in: post.tags },
      });
      post.isPlused = isPlused;
      post.isFavourite = isFavourite;
      post.user.method = userMethod?.method || "";
      post.tags = post.tags.map((tag: string) => ({
        name: tag,
        method: userTags.find((item) => item.name === tag)?.method || "",
      }));
    } else {
      post.tags = post.tags.map((tag: string) => ({
        name: tag,
        method: "",
      }));
    }

    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
      },
    };
  }
);

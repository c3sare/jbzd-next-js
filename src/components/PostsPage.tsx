import PageSelect from "./PageSelect";
import Post from "./Post";
import style from "@/styles/posts.module.css";
import PostsOptions from "./PostsOptions";
import Breadcrumb from "./Breadcrumb";
import { useRouter } from "next/router";
import Link from "next/link";

interface PostsPageInterface {
  posts: {}[];
  currentPage: number;
  allPages: number;
  pageName?: string;
  category?: string;
  hideButtons?: boolean;
  nodeName: string;
  isHomePage?: boolean;
}

const PostsPage = ({
  posts,
  currentPage,
  allPages,
  pageName,
  category,
  hideButtons,
  nodeName,
  isHomePage = false,
}: PostsPageInterface) => {
  return (
    <>
      <Breadcrumb
        currentNode={currentPage > 1 ? `Strona ${currentPage}` : nodeName}
      >
        {!isHomePage ? <Link href="/">Strona Główna</Link> : null}
        {currentPage > 1 ? <Link href={`/${pageName}`}>{nodeName}</Link> : null}
      </Breadcrumb>
      {!hideButtons && <PostsOptions category={category} />}
      <div className={style.posts}>
        {posts.map((postMain: any, i: number) => (
          <Post key={i} post={postMain} />
        ))}
      </div>
      {allPages > 1 && (
        <PageSelect
          pageName={pageName}
          currentPage={currentPage}
          allPages={allPages}
        />
      )}
    </>
  );
};

export default PostsPage;

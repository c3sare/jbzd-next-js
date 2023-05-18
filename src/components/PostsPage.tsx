import PageSelect from "./PageSelect";
import Post from "./Post";
import style from "@/styles/posts.module.css";
import PostsOptions from "./PostsOptions";

interface PostsPageInterface {
  posts: {}[];
  currentPage: number;
  allPages: number;
  pageName?: string;
}

const PostsPage = ({
  posts,
  currentPage,
  allPages,
  pageName,
}: PostsPageInterface) => {
  return (
    <>
      <PostsOptions />
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

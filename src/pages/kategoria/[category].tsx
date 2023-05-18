import PostsPage from "@/components/PostsPage";
import getPosts from "@/utils/getPosts";

const Category = ({ posts, currentPage, allPages }: any) => {
  return (
    <PostsPage
      pageName="oczekujace"
      posts={posts}
      currentPage={currentPage}
      allPages={allPages}
    />
  );
};

export default Category;

export const getServerSideProps = getPosts({});

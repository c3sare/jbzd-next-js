import PostsPage from "@/components/PostsPage";
import Seo from "@/components/Seo";
import getPosts from "@/utils/getPosts";

const Category = ({ posts, currentPage, allPages, category }: any) => {
  return (
    <>
      <Seo
        subTitle={category + (currentPage > 1 ? `, strona ${currentPage}` : "")}
      />
      <PostsPage
        pageName="oczekujace"
        posts={posts}
        currentPage={currentPage}
        allPages={allPages}
      />
    </>
  );
};

export default Category;

export const getServerSideProps = getPosts({});

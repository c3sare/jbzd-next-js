import PostsPage from "@/components/PostsPage";
import Seo from "@/components/Seo";
import getPosts from "@/utils/getPosts";

const Index = ({ posts, currentPage, allPages }: any) => {
  return (
    <>
      <Seo />
      <PostsPage
        nodeName="Strona Główna"
        posts={posts}
        currentPage={currentPage}
        allPages={allPages}
        isHomePage
      />
    </>
  );
};

export default Index;

export const getServerSideProps = getPosts({
  options: { accepted: true },
});

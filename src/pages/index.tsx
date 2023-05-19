import PostsPage from "@/components/PostsPage";
import Seo from "@/components/Seo";
import getPosts from "@/utils/getPosts";

const Index = ({ posts, currentPage, allPages }: any) => {
  return (
    <>
      <Seo />
      <PostsPage posts={posts} currentPage={currentPage} allPages={allPages} />
    </>
  );
};

export default Index;

export const getServerSideProps = getPosts({ accepted: true });

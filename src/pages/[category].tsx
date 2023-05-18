import PostsPage from "@/components/PostsPage";
import getPosts from "@/utils/getPosts";

const Index = ({ posts, currentPage, allPages }: any) => {
  return (
    <PostsPage posts={posts} currentPage={currentPage} allPages={allPages} />
  );
};

export default Index;

export const getServerSideProps = getPosts({}, true);

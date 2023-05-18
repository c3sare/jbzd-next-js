import PostsPage from "@/components/PostsPage";
import getPosts from "@/utils/getPosts";

const Waitings = ({ posts, currentPage, allPages }: any) => {
  return (
    <PostsPage
      pageName="oczekujace"
      posts={posts}
      currentPage={currentPage}
      allPages={allPages}
    />
  );
};

export default Waitings;

export const getServerSideProps = getPosts({ accepted: false });

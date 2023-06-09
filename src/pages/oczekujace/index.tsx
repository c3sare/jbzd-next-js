import PostsPage from "@/components/PostsPage";
import Seo from "@/components/Seo";
import getPosts from "@/utils/getPosts";

const Waitings = ({ posts, currentPage, allPages }: any) => {
  return (
    <>
      <Seo subTitle="Oczekujące" />
      <PostsPage
        nodeName="Oczekujące"
        pageName="oczekujace"
        posts={posts}
        currentPage={currentPage}
        allPages={allPages}
      />
    </>
  );
};

export default Waitings;

export const getServerSideProps = getPosts({ options: { accepted: false } });

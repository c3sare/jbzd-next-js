import PostsPage from "@/components/PostsPage";
import getPosts from "@/utils/getPosts";
import Seo from "@/components/Seo";
import { useRouter } from "next/router";

const Index = ({ posts, currentPage, allPages }: any) => {
  const router = useRouter();

  return (
    <>
      <Seo />
      <PostsPage
        nodeName="Tag"
        pageName={`tag/${router.query.tag}`}
        posts={posts}
        currentPage={currentPage}
        allPages={allPages}
      />
    </>
  );
};

export default Index;

export const getServerSideProps = getPosts({}, false, "", true);

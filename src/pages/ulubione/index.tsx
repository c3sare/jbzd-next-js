import PostsPage from "@/components/PostsPage";
import Seo from "@/components/Seo";
import getPosts from "@/utils/getPosts";

const Favourites = ({ posts, currentPage, allPages }: any) => {
  return (
    <>
      <Seo title="Ulubione" />
      <PostsPage
        nodeName="Ulubione"
        pageName="ulubione"
        posts={posts}
        currentPage={currentPage}
        allPages={allPages}
        hideButtons
      />
    </>
  );
};

export default Favourites;

export const getServerSideProps = getPosts({
  options: {},
  personalType: "FAVOURITES",
});

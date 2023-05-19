import ConfirmOfAge from "@/components/ConfirmOfAge";
import PostsPage from "@/components/PostsPage";
import Seo from "@/components/Seo";
import getPosts from "@/utils/getPosts";

const Index = ({
  posts,
  currentPage,
  allPages,
  category,
  nsfw,
  ofage,
}: any) => {
  return (
    <>
      <Seo
        subTitle={category + (currentPage > 1 ? `, strona ${currentPage}` : "")}
      />
      {nsfw && !ofage ? (
        <ConfirmOfAge />
      ) : (
        <PostsPage
          posts={posts}
          currentPage={currentPage}
          allPages={allPages}
        />
      )}
    </>
  );
};

export default Index;

export const getServerSideProps = getPosts({}, true);

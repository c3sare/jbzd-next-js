import ConfirmOfAge from "@/components/ConfirmOfAge";
import PostsPage from "@/components/PostsPage";
import Seo from "@/components/Seo";
import getPosts from "@/utils/getPosts";

const Index = ({
  posts,
  currentPage,
  allPages,
  category,
  categorySlug,
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
          pageName={categorySlug}
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

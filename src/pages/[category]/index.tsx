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
  isFollowedCategory,
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
          nodeName={category}
          category={categorySlug}
          pageName={categorySlug}
          posts={posts}
          currentPage={currentPage}
          allPages={allPages}
          isFollowedCategory={isFollowedCategory}
        />
      )}
    </>
  );
};

export default Index;

export const getServerSideProps = getPosts({ options: {}, asPage: true });

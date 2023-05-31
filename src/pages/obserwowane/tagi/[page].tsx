import PostsPage from "@/components/PostsPage";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import createNotifycation from "@/utils/createNotifycation";
import getPosts from "@/utils/getPosts";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Seo from "@/components/Seo";

const Index = ({ posts, currentPage, allPages, noFollowed }: any) => {
  const router = useRouter();
  const { setNotifys } = useContext(GlobalContext) as GlobalContextInterface;

  useEffect(() => {
    if (noFollowed) {
      createNotifycation(
        setNotifys,
        "info",
        "Nie zaobserwowałeś jeszcze żadnego tagu!"
      );
      router.push("/");
    }
  }, [noFollowed, router, setNotifys]);

  return noFollowed ? (
    <></>
  ) : (
    <>
      <Seo subTitle={`Obserwowane tagi, strona ${currentPage}`} />
      <PostsPage
        pageName="obserwowane/tagi"
        posts={posts}
        currentPage={currentPage}
        allPages={allPages}
      />
    </>
  );
};

export default Index;

export const getServerSideProps = getPosts({}, false, "TAG");

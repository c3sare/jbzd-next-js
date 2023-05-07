import style from "@/styles/posts.module.css";
import Post from "@/components/Post";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdFunnel } from "react-icons/io";
import { useContext, useState } from "react";
import AddPost from "@/components/AddPost";
import TopFilter from "@/components/TopFilter";
import PostFilter from "@/components/PostFilter";
import createNotifycation from "@/utils/createNotifycation";
import Posts from "@/models/Post";
import dbConnect from "@/lib/dbConnect";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import Comment from "@/models/Comment";
import getHomePagePosts from "@/utils/getHomePagePosts";

const Index = ({ posts }: any) => {
  const [currentOption, setCurrentOption] = useState<number>(0);
  const {
    login: { logged },
    setNotifys,
  } = useContext(GlobalContext) as GlobalContextInterface;

  const options = [
    null,
    <AddPost setOption={setCurrentOption} key={1} />,
    <TopFilter key={2} />,
    <PostFilter key={3} />,
  ];

  const setOption = (num: number) => {
    if (num === currentOption) setCurrentOption(0);
    else setCurrentOption(num);
  };

  return (
    <>
      <div className={style.buttonsMain}>
        <button
          className={style.addMem}
          onClick={() => {
            if (!logged) {
              setOption(0);
              return createNotifycation(
                setNotifys,
                "info",
                "Dostęp dla zalogowanych!"
              );
            }

            setOption(1);
          }}
        >
          + Dodaj dzidę
        </button>
        <button
          onClick={() => setOption(2)}
          className={currentOption === 2 ? style.active : ""}
        >
          <FaRegCalendarAlt /> Top +
        </button>
        <button
          onClick={() => setOption(3)}
          className={currentOption === 3 ? style.active : ""}
        >
          <IoMdFunnel /> Filtruj
        </button>
      </div>
      <div className={style.filterComponents}>
        {currentOption === 2 && options[2]}
        {currentOption === 3 && options[3]}
      </div>
      {currentOption === 1 && <AddPost setOption={setOption} />}
      <div className={style.posts}>
        {posts.map((postMain: any, i: number) => (
          <Post key={i} post={postMain} />
        ))}
      </div>
    </>
  );
};

export default Index;

export async function getServerSideProps() {
  await dbConnect();
  const posts = await getHomePagePosts();

  console.log(posts);
  return { props: { posts: JSON.parse(JSON.stringify(posts)) } };
}

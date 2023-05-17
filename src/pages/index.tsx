import style from "@/styles/posts.module.css";
import Post from "@/components/Post";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdFunnel } from "react-icons/io";
import { useContext, useState } from "react";
import AddPost from "@/components/AddPost";
import TopFilter from "@/components/TopFilter";
import PostFilter from "@/components/PostFilter";
import createNotifycation from "@/utils/createNotifycation";
import dbConnect from "@/lib/dbConnect";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import { Postsstats } from "@/models/Post";
import Blacklist from "@/models/Blacklist";
import { withSessionSSR } from "@/lib/AuthSession/session";
import PageSelect from "@/components/PageSelect";

const Index = ({ posts, currentPage, allPages }: any) => {
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
      <PageSelect currentPage={currentPage} allPages={allPages} />
    </>
  );
};

export default Index;

export const getServerSideProps = withSessionSSR(
  async function getServerSideProps({ req }: any) {
    const session = req.session?.user;
    await dbConnect();

    let findOptions: any = { accepted: true };

    if (session?.logged && session?.login) {
      findOptions.author = {
        $nin: (await Blacklist.find({ username: session?.login })).map(
          (item) => item.user
        ),
      };
    }
    const allPosts = await Postsstats.count(findOptions);

    const allPages = Math.ceil(allPosts / 8);

    const posts = await Postsstats.find(findOptions).limit(8);
    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
        currentPage: 1,
        allPages,
      },
    };
  }
);

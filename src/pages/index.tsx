import style from "@/styles/posts.module.css";
import posts from "@/data/posts";
import Post from "@/components/Post";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdFunnel } from "react-icons/io";
import { useContext, useState } from "react";
import AddPost from "@/components/AddPost";
import TopFilter from "@/components/TopFilter";
import PostFilter from "@/components/PostFilter";
import { LoginContext } from "@/context/login";
import { NotifyReducer } from "@/context/notify";
import createNotifycation from "@/utils/createNotifycation";

const Index = () => {
  const [currentOption, setCurrentOption] = useState<number>(0);
  const { logged } = useContext(LoginContext);
  const notifyDispatch = useContext(NotifyReducer);

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
            if (!logged)
              return createNotifycation(
                notifyDispatch,
                "info",
                "Dostęp dla zalogowanych!"
              );

            setOption(1);
          }}
        >
          + Dodaj dzidę
        </button>
        <button onClick={() => setOption(2)}>
          <FaRegCalendarAlt /> Top +{currentOption === 2 && options[2]}
        </button>
        <button onClick={() => setOption(3)}>
          <IoMdFunnel /> Filtruj
          {currentOption === 3 && options[3]}
        </button>
      </div>
      {currentOption === 1 && <AddPost setOption={setOption} />}
      <div className={style.posts}>
        {posts.map((postMain, i) => (
          <Post key={i} post={postMain} />
        ))}
      </div>
    </>
  );
};

export default Index;

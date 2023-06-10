import style from "@/styles/posts.module.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdFunnel } from "react-icons/io";
import AddPost from "@/components/AddPost";
import TopFilter from "@/components/TopFilter";
import PostFilter from "@/components/PostFilter";
import createNotifycation from "@/utils/createNotifycation";
import { useContext, useState } from "react";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";

const PostsOptions = ({
  category,
  isFollowedCategory,
}: {
  category?: string;
  isFollowedCategory?: boolean;
}) => {
  const {
    login: { logged },
    setNotifys,
  } = useContext(GlobalContext) as GlobalContextInterface;
  const [currentOption, setCurrentOption] = useState<number>(0);
  const [followCategory, setFollowCategory] = useState<boolean>(
    isFollowedCategory || false
  );
  const options = [
    null,
    <AddPost setOption={setCurrentOption} key={1} />,
    <TopFilter setOption={setCurrentOption} key={2} />,
    <PostFilter setOption={setCurrentOption} key={3} />,
  ];

  const setOption = (num: number) => {
    if (num === currentOption) setCurrentOption(0);
    else setCurrentOption(num);
  };

  const handleFollowSection = async (slug: string) => {
    const req = await fetch("/api/user/lists/section/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: slug }),
    });

    const res = await req.json();

    if (req.status === 200) {
      if (res.method === "ADD") {
        setFollowCategory(true);
      } else setFollowCategory(false);
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
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
        {category && (
          <button
            className={followCategory ? style.followed : ""}
            onClick={() => handleFollowSection(category)}
          >
            {followCategory ? "Nie obserwuj działu" : "Obserwuj dział"}
          </button>
        )}
      </div>
      <div className={style.filterComponents}>
        {currentOption === 2 && options[2]}
        {currentOption === 3 && options[3]}
      </div>
      {currentOption === 1 && <AddPost setOption={setOption} />}
    </>
  );
};

export default PostsOptions;

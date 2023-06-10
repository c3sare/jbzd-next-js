import style from "@/styles/posts.module.css";
import alongAgo from "@/utils/alongAgoFunction";
import { FaComment, FaStar, FaCaretUp } from "react-icons/fa";
import { RiDeleteBin7Fill } from "react-icons/ri";
import rockLike from "@/images/likes/like_rock.png";
import silverLike from "@/images/likes/like_silver.png";
import goldLike from "@/images/likes/like_gold.png";
import coins from "@/images/likes/coins.png";
import coin from "@/images/coin.png";
import Link from "next/link";
import avatar from "@/images/avatars/default.jpg";
import Image from "next/image";
import { useContext, useState, Fragment, useMemo, useCallback } from "react";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import createNotifycation from "@/utils/createNotifycation";
import VideoPlayer from "./VideoPlayer";
import createSlug from "@/utils/createSlug";
import YouTube from "react-youtube";
import { useRouter } from "next/router";
import AuthorInfo from "./AuthorInfo";
import Badges from "./Badges";

interface BadgeInterface {
  [key: string]: number;
}

interface PostProps {
  post: {
    _id: string;
    title: string;
    memContainers: {
      data: string;
      type: "image" | "text" | "youtube" | "video";
    }[];
    comments: number;
    tags: {
      name: string;
      method: "" | "FOLLOW" | "BLOCK";
    }[];
    category: string;
    addTime: string;
    author: string;
    user?: {
      avatar: string;
      username: string;
      spears: number;
      rank: number;
      method: "" | "BLOCK" | "FOLLOW";
    };
    plus: number;
    rock: number;
    silver: number;
    gold: number;
    isPlused?: boolean;
    isFavourite?: boolean;
  };
  single?: boolean;
  showTags?: boolean;
}

const Post = ({ post, single = false, showTags = false }: PostProps) => {
  const router = useRouter();
  const [showButtons, setShowButtons] = useState(false);
  const {
    login: { logged, login },
    categories,
    setNotifys,
    createMonit,
  } = useContext(GlobalContext) as GlobalContextInterface;
  const [isPlused, setIsPlused] = useState<boolean>(post.isPlused || false);
  const [isFavourite, setIsFavourite] = useState<boolean>(
    post.isFavourite || false
  );
  const [badges, setBadges] = useState<BadgeInterface>({
    plus: post.plus,
    rock: post.rock,
    silver: post.silver,
    gold: post.gold,
  });
  const [tags, setTags] = useState<
    { name: string; method: "" | "FOLLOW" | "BLOCK" }[]
  >(post.tags);

  const setBadge = (type: string, count: number) => {
    setBadges((prevState) => {
      let newState: BadgeInterface = { ...prevState };
      if (["plus", "rock", "silver", "gold"].includes(type.toLowerCase()))
        newState[type.toLowerCase()] = count;
      else if (type.toLowerCase() === "unplus") {
        newState["plus"] = count;
      }

      return newState;
    });
  };

  const category =
    post.category === ""
      ? {}
      : categories.length > 0
      ? categories.find((item) => item.slug === post.category)
      : {};

  const postUrl = `/obr/${post._id}/${createSlug(post.title)}`;

  const LinkToPost = useCallback(
    ({ children }: any) =>
      single ? children : <Link href={postUrl}>{children}</Link>,
    [postUrl, single]
  );

  const handlePlusPost = async (id: string) => {
    if (!logged)
      return createNotifycation(
        setNotifys,
        "info",
        "Ta strona wymaga zalogowania"
      );

    const req = await fetch(`/api/post/${id}/plus`, { method: "POST" });
    const res = await req.json();

    if (req.status === 200) {
      setBadge(res.method, res.count);
      if (res.method === "PLUS") {
        setIsPlused(true);
      } else {
        setIsPlused(false);
      }
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
  };

  const handleFavouritePost = async (id: string) => {
    if (!logged)
      return createNotifycation(
        setNotifys,
        "info",
        "Ta strona wymaga zalogowania"
      );

    const req = await fetch(`/api/post/${id}/favourite`, { method: "POST" });

    const res = await req.json();

    if (req.status === 200) {
      if (res.method === "LIKED") {
        setIsFavourite(true);
      } else if (res.method === "UNLIKED") {
        setIsFavourite(false);
      }
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
  };

  const allPostElements = useMemo(
    () =>
      post.memContainers.map((item: any, i: number) => {
        if (item.type === "image") {
          return (
            <LinkToPost key={i}>
              <Image
                src={item.data}
                width={600}
                height={500}
                alt={post.title}
              />
            </LinkToPost>
          );
        } else if (item.type === "video") {
          return <VideoPlayer key={i} url={item.data} />;
        } else if (item.type === "youtube") {
          return (
            <YouTube
              key={i}
              opts={{ width: "100%", height: "338px" }}
              videoId={item.data}
              style={{ width: "600px", maxWidth: "100%" }}
            />
          );
        } else if (item.type === "text") {
          return (
            <LinkToPost key={i}>
              <div
                className={style.textBoard}
                dangerouslySetInnerHTML={{ __html: item.data }}
              ></div>
            </LinkToPost>
          );
        } else if (item.type === "gif") {
          return <VideoPlayer key={i} url={item.data} gif />;
        } else {
          return <Fragment key={i}></Fragment>;
        }
      }),
    [post, LinkToPost]
  );

  const handleGiveBadge = async (type: "ROCK" | "SILVER" | "GOLD") => {
    if (!logged)
      return createNotifycation(
        setNotifys,
        "info",
        "Aby to zrobić musisz być zalogowany!"
      );
    const req = await fetch("/api/post/" + post._id + "/badge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
      }),
    });

    const res = await req.json();
    if (req.status === 200) {
      createNotifycation(setNotifys, "info", res.message);
      setBadge(res.type, res.count);
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
  };

  const handleDeleteMem = async (id: string) => {
    const req = await fetch("/api/posts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const res = await req.json();

    if (req.status === 200) {
      router.push("/");
    }
    createNotifycation(setNotifys, "info", res.message);
  };

  const handleAddTagToFollowed = async (tag: string) => {
    const req = await fetch("/api/user/lists/tag/follow", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ name: tag }),
    });
    const res = await req.json();

    if (req.status === 200) {
      if (res.method === "ADD") {
        setTags((state) => {
          const newTags = [...state];

          return newTags.map((item) => {
            if (item.name === tag) item.method = "FOLLOW";

            return item;
          });
        });
      } else {
        setTags((state) => {
          const newTags = [...state];

          return newTags.map((item) => {
            if (item.name === tag) item.method = "";

            return item;
          });
        });
      }
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
  };

  const handleAddTagToBlackList = async (tag: string) => {
    const req = await fetch("/api/user/lists/tag/block", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ name: tag }),
    });
    const res = await req.json();

    if (req.status === 200) {
      if (res.method === "ADD") {
        setTags((state) => {
          const newTags = [...state];

          return newTags.map((item) => {
            if (item.name === tag) item.method = "BLOCK";

            return item;
          });
        });
      } else {
        setTags((state) => {
          const newTags = [...state];

          return newTags.map((item) => {
            if (item.name === tag) item.method = "";

            return item;
          });
        });
      }
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
  };

  const userAvatar =
    post.user?.avatar === "" || !post.user?.avatar ? avatar : post.user?.avatar;

  return (
    <div className={style.post} key={post._id}>
      <div className={style.avatar}>
        <Link href={post.user ? `/uzytkownik/${post.user?.username}` : "/#"}>
          <Image
            height={40}
            width={40}
            src={userAvatar}
            alt={post.user?.username + " avatar"}
          />
        </Link>
      </div>
      <div className={style.contentPost}>
        <div className={style.postHeader}>
          <h2>
            {" "}
            <LinkToPost>{post.title}</LinkToPost>{" "}
          </h2>
          <span className={style.iconComments}>
            <FaComment />
            {post.comments}
          </span>
        </div>
        <div className={style.memDetails}>
          <div className={style.userAddTimeDetails}>
            {post.user && (
              <span className={style.userName}>
                <span className={style.author}>{post.user?.username}</span>
                <AuthorInfo user={post.user} />
              </span>
            )}
            <span className={style.addTime}>{alongAgo(post.addTime)}</span>
            {post.category !== "" && (
              <Link
                href={`/${
                  category.asPage ? "" : "kategoria/"
                }${post.category.toLowerCase()}`}
                style={{ color: "#bd3c3c" }}
              >
                {category.name}
              </Link>
            )}
          </div>
          <Badges badges={badges} />
        </div>
        {showTags && (
          <div className={style.articleTags}>
            <div className={style.articleTagsContent}>
              <div>
                {tags.map((tag) => (
                  <span key={tag.name} className={style.articleTag}>
                    <Link href={`/tag/${tag.name}`}>#{tag.name}</Link>
                    {logged && (
                      <div className={style.observeContainer}>
                        <button
                          onClick={() => handleAddTagToFollowed(tag.name)}
                          {...(tag.method === "FOLLOW"
                            ? { className: style.active }
                            : {})}
                        >
                          Obserwuj
                        </button>
                        <button
                          onClick={() => handleAddTagToBlackList(tag.name)}
                          {...(tag.method === "BLOCK"
                            ? { className: style.active }
                            : {})}
                        >
                          Czarna lista
                        </button>
                      </div>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        {allPostElements}
      </div>
      <div className={style.buttonsPost}>
        {logged && post.author === login && (
          <button
            aria-label="Usuń dzidę"
            onClick={() =>
              createMonit(
                "Potwierdzenie",
                "Czy chcesz usunąć wybraną dzidę?",
                () => handleDeleteMem(post._id)
              )
            }
          >
            <RiDeleteBin7Fill />
          </button>
        )}
        <div style={{ position: "relative" }}>
          <button
            className={style.coins}
            aria-label="Nagradzanie"
            onClick={() => setShowButtons(!showButtons)}
          >
            <span>
              <FaCaretUp
                style={showButtons ? { transform: "rotate(180deg)" } : {}}
              />
              <Image width={25} src={coins} alt="Monety" />
            </span>
          </button>
          {showButtons && (
            <div className={style.buttonsCoins}>
              <button
                aria-label="Nagródź złotą dzidą"
                onClick={() => handleGiveBadge("GOLD")}
              >
                <Image src={goldLike} width={25} alt="Złota Dzida" />
                <span>
                  1000
                  <Image src={coin} width={15} alt="Moneta" />
                </span>
              </button>
              <button
                aria-label="Nagródź srebrną dzidą"
                onClick={() => handleGiveBadge("SILVER")}
              >
                <Image src={silverLike} width={25} alt="Srebrna Dzida" />
                <span>
                  400
                  <Image src={coin} width={15} alt="Moneta" />
                </span>
              </button>
              <button
                aria-label="Nagródź kamienną dzidą"
                onClick={() => handleGiveBadge("ROCK")}
              >
                <Image src={rockLike} width={25} alt="Kamienna Dzida" />
                <span>
                  100
                  <Image src={coin} width={15} alt="Moneta" />
                </span>
              </button>
            </div>
          )}
        </div>
        <Link href={single ? "#komentarze" : postUrl + "#komentarze"}>
          <button aria-label="Przejdź do komentarzy">
            <FaComment />
          </button>
        </Link>
        {logged && (
          <button
            aria-label="Dodaj dzidę do ulubionych"
            className={style.star + (isFavourite ? " " + style.active : "")}
            onClick={() => handleFavouritePost(post._id)}
          >
            <FaStar />
          </button>
        )}
        <span className={style.likeCounter}>+{badges.plus}</span>
        <button
          aria-label="Zaplusuj dzidę"
          className={style.plus + (isPlused ? " " + style.added : "")}
          onClick={() => handlePlusPost(post._id)}
        >
          <span className={style.plusIcon}>+</span>
          <span className={style.text}>+{badges.plus}</span>
        </button>
      </div>
    </div>
  );
};

export default Post;

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
import { TfiCup } from "react-icons/tfi";
import createSlug from "@/utils/createSlug";
import YouTube from "react-youtube";
import { useRouter } from "next/router";

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
    tags: string[];
    category: string;
    addTime: string;
    author: string;
    user: {
      avatar: string;
      username: string;
      spears: number;
      rank: number;
    };
    plus: number;
    rock: number;
    silver: number;
    gold: number;
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
    plused,
    refreshPlused,
    favourites,
    refreshFavourites,
    lists,
    refreshLists,
    createMonit,
  } = useContext(GlobalContext) as GlobalContextInterface;
  const [badges, setBadges] = useState<BadgeInterface>({
    plus: post.plus,
    rock: post.rock,
    silver: post.silver,
    gold: post.gold,
  });
  const [spears, setSpears] = useState<number>(post.user?.spears || 0);

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
      refreshPlused();
      setBadge(res.method, res.count);
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
  };

  const handleFavouritePost = (id: string) => {
    if (!logged)
      return createNotifycation(
        setNotifys,
        "info",
        "Ta strona wymaga zalogowania"
      );

    fetch(`/api/post/${id}/favourite`, { method: "POST" })
      .then((res) => res.json())
      .then(() => refreshFavourites())
      .catch((err) => {
        console.error(err);
      });
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

  const handleClickBlacklist = async (username: string) => {
    const req = await fetch("/api/user/lists/user/block", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: username }),
    });
    const res = await req.json();

    if (req.status === 200) {
      refreshLists();
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
  };

  const handleClickObservelist = async (username: string) => {
    const req = await fetch("/api/user/lists/user/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: username }),
    });
    const res = await req.json();

    if (req.status === 200) {
      refreshLists();
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

  const handleAddSpear = async (username: string) => {
    const req = await fetch(`/api/user/${username}/spear`, {
      method: "POST",
    });

    const res = await req.json();
    if (req.status === 200) {
      setSpears(res.counter);
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
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
      refreshLists();
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
      refreshLists();
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
                <div className={style.authorInfo}>
                  <div className={style.detailsAvatar}>
                    <Image
                      alt={post.user?.username + " avatar"}
                      width={45}
                      height={45}
                      src={userAvatar}
                    />
                  </div>
                  <div className={style.userPostContent}>
                    <div className={style.userPostName}>
                      {post.user?.username}
                    </div>
                    <div className={style.userPostInfo}>
                      <div>
                        <span>
                          <Image
                            src="/images/spear.png"
                            width={22}
                            height={22}
                            alt="Dzida"
                          />
                        </span>
                        <span>{spears}</span>
                        {logged && login !== post.user?.username && (
                          <button
                            className={style.userVote}
                            onClick={() => handleAddSpear(post.user?.username)}
                          >
                            +
                          </button>
                        )}
                      </div>
                      <div>
                        <span>
                          <TfiCup />
                        </span>
                        <span>{post.user?.rank}</span>
                      </div>
                    </div>
                    <div className={style.userPostActions}>
                      <button
                        disabled={post.user?.username === login}
                        className={
                          lists.user.follow.includes(post.user?.username)
                            ? style.observed
                            : ""
                        }
                        onClick={() =>
                          handleClickObservelist(post.user?.username)
                        }
                      >
                        Obserwuj
                      </button>
                      <button
                        disabled={post.user?.username === login}
                        className={
                          lists.user.block.includes(post.user?.username)
                            ? style.blacklisted
                            : ""
                        }
                        onClick={() =>
                          handleClickBlacklist(post.user?.username)
                        }
                      >
                        Czarna lista
                      </button>
                      <Link href={"/uzytkownik/" + post.user?.username}>
                        Profil
                      </Link>
                    </div>
                  </div>
                </div>
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
          <div className={style.otherLikes}>
            {badges.rock > 0 && (
              <div className={style.likeContainer}>
                <div className={style.image}>
                  <Image width={25} src={rockLike} alt="Kamienna Dzida" />
                  <span>Kamienna&nbsp;Dzida</span>
                </div>
                <span>{badges.rock}</span>
              </div>
            )}
            {badges.silver > 0 && (
              <div className={style.likeContainer}>
                <div className={style.image}>
                  <Image width={25} src={silverLike} alt="Srebrna Dzida" />
                  <span>Srebrna&nbsp;Dzida</span>
                </div>
                <span>{badges.silver}</span>
              </div>
            )}
            {badges.gold > 0 && (
              <div className={style.likeContainer}>
                <div className={style.image}>
                  <Image width={25} src={goldLike} alt="Złota Dzida" />
                  <span>Złota&nbsp;Dzida</span>
                </div>
                <span>{badges.gold}</span>
              </div>
            )}
          </div>
        </div>
        {showTags && (
          <div className={style.articleTags}>
            <div className={style.articleTagsContent}>
              <div>
                {post.tags.map((tag) => (
                  <span key={tag} className={style.articleTag}>
                    <Link href={`/tag/${tag}`}>#{tag}</Link>
                    {logged && (
                      <div className={style.observeContainer}>
                        <button
                          onClick={() => handleAddTagToFollowed(tag)}
                          {...(lists.tag.follow.includes(tag)
                            ? { className: style.active }
                            : {})}
                        >
                          Obserwuj
                        </button>
                        <button
                          onClick={() => handleAddTagToBlackList(tag)}
                          {...(lists.tag.block.includes(tag)
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
        {/* <div className={style.comments"}>
              {post.comments.map((comment) => (
                <div className={style.comment" key={comment.id}>
                  <span>
                    <Link href={`/users/${comment.userId}`}>
                      {comment.userName}
                    </Link>
                    <br />
                    {comment.text}
                  </span>
                  <div className={style.likes">
                    <button>+</button>
                    <span>{comment.likes}</span>
                    <button>-</button>
                  </div>
                  <div className={style.subComments">
                    {comment.subcomments.map((subcomment) => (
                      <div className={style.subComment" key={subcomment.id}>
                        <p>{subcomment.text}</p>
                        <div className={style.subLikes">
                          <button>+</button>
                          <span>{comment.likes}</span>
                          <button>-</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div> */}
        <div></div>
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
            className={
              style.star +
              (favourites.includes(post._id) ? " " + style.active : "")
            }
            onClick={() => handleFavouritePost(post._id)}
          >
            <FaStar />
          </button>
        )}
        <span className={style.likeCounter}>+{badges.plus}</span>
        <button
          aria-label="Zaplusuj dzidę"
          className={
            style.plus + (plused.includes(post._id) ? " " + style.added : "")
          }
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

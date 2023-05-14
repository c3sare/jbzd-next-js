import style from "@/styles/posts.module.css";
import alongAgo from "@/utils/alongAgoFunction";
import { FaComment, FaStar, FaCaretUp } from "react-icons/fa";
import rockLike from "@/images/likes/like_rock.png";
import silverLike from "@/images/likes/like_silver.png";
import goldLike from "@/images/likes/like_gold.png";
import coins from "@/images/likes/coins.png";
import coin from "@/images/coin.png";
import Link from "next/link";
import avatar from "@/images/avatars/default.jpg";
import Image from "next/image";
import { useContext, useState, Fragment, useMemo } from "react";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import useSWR from "swr";
import createNotifycation from "@/utils/createNotifycation";
import VideoPlayer from "./VideoPlayer";
import { TfiCup } from "react-icons/tfi";
import createSlug from "@/utils/createSlug";
import YouTube from "react-youtube";

const Post = (props: any) => {
  const { post, single } = props;
  const [showButtons, setShowButtons] = useState(false);
  const {
    login: { logged, login },
    categories,
    setNotifys,
  } = useContext(GlobalContext) as GlobalContextInterface;

  const category =
    post.category === ""
      ? {}
      : categories.length > 0
      ? categories.find((item) => item.slug === post.category)
      : {};

  const { data, error, isLoading, mutate } = useSWR(
    "/api/posts/stats/" + post._id,
    { refreshInterval: 0 }
  );

  const LinkToPost = ({ children }: any) =>
    single ? (
      children
    ) : (
      <Link href={`/obr/${post._id}/${createSlug(post.title)}`}>
        {children}
      </Link>
    );

  const handlePlusPost = (id: string) => {
    if (!logged)
      return createNotifycation(
        setNotifys,
        "info",
        "Ta strona wymaga zalogowania"
      );

    fetch(`/api/post/${id}/plus`, { method: "POST" })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => mutate());
  };

  const handleFavouritePost = (id: string) => {
    if (!logged)
      return createNotifycation(
        setNotifys,
        "info",
        "Ta strona wymaga zalogowania"
      );

    fetch(`/api/post/${id}/favourite`, { method: "POST" })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => mutate());
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
        } else {
          return <Fragment key={i}></Fragment>;
        }
      }),
    [post, LinkToPost]
  );

  const handleGiveBadge = async (type: "ROCK" | "SILVER" | "GOLD") => {
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
      mutate();
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
  };

  const userAvatar = post.author.avatar === "" ? avatar : post.author.avatar;

  return (
    <div className={style.post} key={post._id}>
      <div className={style.avatar}>
        <Link href={`/uzytkownik/${post.author?.username}`}>
          <Image
            height={40}
            width={40}
            src={post.author.avatar === "" ? avatar : post.author.avatar}
            alt={post.author.username + " avatar"}
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
            {!error && !isLoading ? data.comments : "..."}
          </span>
        </div>
        <div className={style.memDetails}>
          <div className={style.userAddTimeDetails}>
            <span className={style.userName}>
              <span className={style.author}>{post.author.username}</span>
              <div className={style.authorInfo}>
                <div className={style.detailsAvatar}>
                  <Image
                    alt={post.author.username + " avatar"}
                    width={45}
                    height={45}
                    src={userAvatar}
                  />
                </div>
                <div className={style.userPostContent}>
                  <div className={style.userPostName}>
                    {post.author.username}
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
                      <span>{post.author.spears}</span>
                      {logged && <button className={style.userVote}>+</button>}
                    </div>
                    <div>
                      <span>
                        <TfiCup />
                      </span>
                      <span>1</span>
                    </div>
                  </div>
                  <div className={style.userPostActions}>
                    <button className={style.observed}>Obserwuj</button>
                    <button className={style.blacklisted}>Czarna lista</button>
                    <Link href={"/uzytkownik/" + post.author.username}>
                      Profil
                    </Link>
                  </div>
                </div>
              </div>
            </span>
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
            {!error && !isLoading
              ? data.rock > 0 && (
                  <div className={style.likeContainer}>
                    <div className={style.image}>
                      <Image width={25} src={rockLike} alt="Kamienna Dzida" />
                      <span>Kamienna&nbsp;Dzida</span>
                    </div>
                    <span>{data.rock}</span>
                  </div>
                )
              : null}
            {!error && !isLoading
              ? data.silver > 0 && (
                  <div className={style.likeContainer}>
                    <div className={style.image}>
                      <Image width={25} src={silverLike} alt="Srebrna Dzida" />
                      <span>Srebrna&nbsp;Dzida</span>
                    </div>
                    <span>{data.silver}</span>
                  </div>
                )
              : null}
            {!error && !isLoading
              ? data.gold > 0 && (
                  <div className={style.likeContainer}>
                    <div className={style.image}>
                      <Image width={25} src={goldLike} alt="Złota Dzida" />
                      <span>Złota&nbsp;Dzida</span>
                    </div>
                    <span>{data.gold}</span>
                  </div>
                )
              : null}
          </div>
        </div>
        {allPostElements}
        {/* <div className={style.comments">
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
        </button>
        <button aria-label="Przejdź do komentarzy">
          <FaComment />
        </button>
        {logged && (
          <button
            aria-label="Dodaj dzidę do ulubionych"
            className={
              style.star + (data?.isFavourite ? " " + style.active : "")
            }
            onClick={() => handleFavouritePost(post._id)}
          >
            <FaStar />
          </button>
        )}
        <span className={style.likeCounter}>
          +{!error && !isLoading ? data.pluses : 0}
        </span>
        <button
          aria-label="Zaplusuj dzidę"
          className={style.plus + (data?.isPlused ? " " + style.added : "")}
          onClick={() => handlePlusPost(post._id)}
        >
          <span className={style.plusIcon}>+</span>
          <span className={style.text}>
            +{!error && !isLoading ? data.pluses : 0}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Post;

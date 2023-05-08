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
import { useContext, useState, Fragment } from "react";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import useSWR from "swr";
import createNotifycation from "@/utils/createNotifycation";
import VideoPlayer from "./VideoPlayer";

const Post = (props: any) => {
  const { post } = props;
  const [showButtons, setShowButtons] = useState(false);
  const {
    login: { logged },
    categories,
    setNotifys,
  } = useContext(GlobalContext) as GlobalContextInterface;

  const category =
    props.category === ""
      ? {}
      : categories.length > 0
      ? categories.find((item) => item.slug === post.category)
      : {};

  const { data, error, isLoading, mutate } = useSWR(
    "/api/posts/stats/" + post._id
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

  return (
    <div className={style.post} key={post._id}>
      <div className={style.avatar}>
        <Link href={`/uzytkownik/${post.author}`}>
          <Image src={avatar} alt="Avatar" />
        </Link>
      </div>
      <div className={style.contentPost}>
        <div className={style.postHeader}>
          <h2>{post.title}</h2>
          <span className={style.iconComments}>
            <FaComment />
            {!error && !isLoading ? data.comments : "..."}
          </span>
        </div>
        <div className={style.memDetails}>
          <div className={style.userAddTimeDetails}>
            <span className={style.userName}>{post.userName}</span>
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
        {post.memContainers.map((item: any, i: number) => {
          if (item.type === "image") {
            return (
              <Image
                key={i}
                src={item.data}
                width={600}
                height={500}
                alt={post.title}
              />
            );
          } else if (item.type === "video") {
            return <VideoPlayer key={i} url={item.data} />;
          } else {
            return <Fragment key={i}></Fragment>;
          }
        })}
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
              <button aria-label="Nagródź złotą dzidą">
                <Image src={goldLike} width={25} alt="Złota Dzida" />
                <span>
                  1000
                  <Image src={coin} width={15} alt="Moneta" />
                </span>
              </button>
              <button aria-label="Nagródź srebrną dzidą">
                <Image src={silverLike} width={25} alt="Srebrna Dzida" />
                <span>
                  400
                  <Image src={coin} width={15} alt="Moneta" />
                </span>
              </button>
              <button aria-label="Nagródź kamienną dzidą">
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
        {/* class added - active */}
      </div>
    </div>
  );
};

export default Post;

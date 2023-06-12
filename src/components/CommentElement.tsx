import rockLike from "@/images/likes/like_rock.png";
import silverLike from "@/images/likes/like_silver.png";
import goldLike from "@/images/likes/like_gold.png";
import coin from "@/images/coin.png";
import alongAgo from "@/utils/alongAgoFunction";
import { BsStarFill } from "react-icons/bs";
import { TiArrowBack } from "react-icons/ti";
import { FaQuoteLeft } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import style from "@/styles/posts.module.css";
import DzidaIcon from "@/icons/DzidaIcon";
import defaultAvatar from "@/images/avatars/default.jpg";
import { useEffect, useRef, useState } from "react";
import AuthorInfo from "./AuthorInfo";
import CommentForm from "./CommentForm";
import { attributesToProps, domToReact } from "html-react-parser";
import Quote from "./Quote";
import parse from "html-react-parser";
import Badges from "./Badges";
import { useContext } from "react";
import createNotifycation from "@/utils/createNotifycation";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";

const options = {
  replace: (node: any) => {
    if (node.attribs && node.name === "a") {
      const props = attributesToProps(node.attribs);
      return (
        <Link href="/" {...props}>
          {domToReact(node.children, options)}
        </Link>
      );
    }
    if (node.name === "q") {
      return <Quote>{domToReact(node.children, options)}</Quote>;
    }
  },
};

interface BadgesInterface {
  rock: number;
  silver: number;
  gold: number;
  score: number;
}

const CommentElement = ({
  comment,
  isSubComment,
  postId,
  commentId,
  refreshComments,
  postLink,
}: {
  comment: any;
  isSubComment?: boolean;
  postId: string;
  commentId: string | null;
  refreshComments: any;
  postLink?: boolean;
}) => {
  const {
    setNotifys,
    refreshCoins,
    login: { logged },
  } = useContext(GlobalContext) as GlobalContextInterface;
  const [showPrices, setShowPrices] = useState<boolean>(false);
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [badges, setBadges] = useState<BadgesInterface>({
    rock: comment.rock,
    silver: comment.silver,
    gold: comment.gold,
    score: comment.score,
  });
  const [voteType, setVoteType] = useState<"" | "PLUS" | "MINUS">(
    comment.voteType || ""
  );
  const [isFavourite, setIsFavourite] = useState<boolean>(
    comment?.isFavourite || false
  );
  const commentText = useRef("");

  const endFunction = () => {
    commentText.current = "";
    setShowCommentForm(false);
  };

  useEffect(() => {
    function closePrices() {
      setShowPrices(false);
    }

    if (showPrices) {
      window.addEventListener("click", closePrices, true);
    } else {
      window.removeEventListener("click", closePrices, true);
    }

    return () => window.removeEventListener("click", closePrices, true);
  }, [showPrices]);

  const parseBBcode = (text: string) => {
    const userNamePattern = /@\[[A-Za-z1-9]*\]/g;
    const quotePattern =
      /\[quote\][\w\d\s\.,!@#$%^&\*()`~?/><'";:|\\}{\[\]+-_]*\[\/quote\]/g;
    const elements: { textElement: string; nodeElement: string }[] = [];
    text = text.replace(/(?:\r\n|\r|\n)/g, "<br/>");
    const nicknames = text.match(userNamePattern);
    const quotes = text.match(quotePattern);
    quotes?.forEach((item) => {
      const startIndex = item.indexOf("[quote]") + 7;
      const endIndex = item.lastIndexOf("[/quote]");
      const quoteText = item.slice(startIndex, endIndex);
      elements.push({
        textElement: item,
        nodeElement: `<q>${quoteText}</q>`,
      });
    });
    nicknames?.forEach((item) => {
      const nick = item.slice(item.indexOf("@[") + 2, item.indexOf("]"));
      elements.push({
        textElement: item,
        nodeElement: `<a href="/uzytkownik/${nick}">@${nick}</a>`,
      });
    });
    let newText = text;
    elements.forEach((item) => {
      newText = newText.replace(item.textElement, item.nodeElement);
    });

    return parse(newText, options);
  };

  const handleAddVote = async (type: "PLUS" | "MINUS") => {
    if (!logged)
      return createNotifycation(
        setNotifys,
        "info",
        "Zaloguj się aby oddać głos"
      );

    const req = await fetch(`/api/comments/${comment._id}/like`, {
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
      setBadges((state) => {
        const newState = { ...state };
        newState.score = res.count;
        return newState;
      });
      if (!res.isBadged) setVoteType("");
      else setVoteType(res.type);
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
  };

  const handleAddBadge = async (type: "ROCK" | "SILVER" | "GOLD") => {
    const req = await fetch(`/api/comments/${comment._id}/badge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
      }),
    });

    const res: {
      message: string;
      count: number;
      type: "ROCK" | "SILVER" | "GOLD";
    } = await req.json();

    if (req.status === 200) {
      setBadges((state) => {
        const newState = { ...state };
        newState[res.type.toLowerCase() as "rock" | "silver" | "gold"] =
          res.count;
        return newState;
      });
      refreshCoins();
    }
    createNotifycation(setNotifys, "info", res.message);
  };

  const handleAddToFavourites = async (id: string) => {
    const req = await fetch(`/api/comments/${id}/favourite`, {
      method: "POST",
    });

    const res = await req.json();
    if (req.status === 200) {
      if (res.method === "LIKE") {
        setIsFavourite(true);
      } else {
        setIsFavourite(false);
      }
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
  };

  return (
    <>
      <div id={comment._id}>
        <article
          className={
            style.comment + (isSubComment ? " " + style.subComment : "")
          }
        >
          <Link
            href={`/uzytkownik/${comment.author}`}
            className={style.commentAvatar}
          >
            <Image
              src={comment?.user?.avatar || defaultAvatar}
              alt=""
              width={33}
              height={33}
            />
          </Link>
          <div className={style.commentContent}>
            <header className={style.commentHeader}>
              <div className={style.commentDetails}>
                <div className={style.commentAuthor}>
                  <span>
                    <span style={{ color: "rgb(139, 216, 43)" }}>
                      {comment.author}
                    </span>
                  </span>
                  <AuthorInfo user={comment.user} />
                </div>
              </div>
              <div className={style.commentDate}>
                {alongAgo(comment.addTime as string)}
              </div>
              <div className={style.commentBadge}>
                <div className={style.badgesInfoContainer}>
                  <Badges badges={badges} />
                </div>
              </div>
              <div className={style.commentScore}>
                <button
                  className={
                    style.commentVote +
                    " " +
                    style.commentVotePlus +
                    (voteType === "PLUS" ? " " + style.activeVotePlus : "")
                  }
                  onClick={() => handleAddVote("PLUS")}
                >
                  <span>+</span>
                </button>
                <span className={style.commentScoreCount}>{badges.score}</span>
                <button
                  className={
                    style.commentVote +
                    " " +
                    style.commentVoteMinus +
                    (voteType === "MINUS" ? " " + style.activeVoteMinus : "")
                  }
                  onClick={() => handleAddVote("MINUS")}
                >
                  <span>-</span>
                </button>
              </div>
            </header>
            <div className={style.commentText}>
              <span>
                <div>
                  <div
                    className={style.readMoreContent}
                    style={{ maxHeight: "none" }}
                  >
                    {parseBBcode(comment.text)}
                  </div>
                </div>
              </span>
            </div>
            {logged && (
              <div className={style.commentReply}>
                <button
                  className={style.commentReplyA}
                  onClick={() => {
                    commentText.current = `@[${comment.author}] `;
                    setShowCommentForm(!showCommentForm);
                  }}
                >
                  <span className={style.commentReplyAIcon}>
                    <TiArrowBack />
                  </span>
                  <span>Odpowiedz</span>
                </button>
                <button
                  className={style.commentReplyA}
                  onClick={() => {
                    commentText.current = `@[${comment.author}] [quote]${comment.text}[/quote] `;
                    setShowCommentForm(!showCommentForm);
                  }}
                >
                  <span
                    className={style.commentReplyAIcon}
                    style={{ fontSize: "16px" }}
                  >
                    <FaQuoteLeft />
                  </span>
                  <span>Zacytuj</span>
                </button>
                <div
                  className={
                    style.commentReplyA + " " + style.commentReplyABadge
                  }
                >
                  <div style={{ position: "relative" }}>
                    <button
                      className={style.commentReplyASelector}
                      onClick={() => {
                        setShowPrices(!showPrices);
                      }}
                    >
                      <DzidaIcon />
                      <span>Nagroda</span>
                    </button>
                    <div
                      className={
                        style.contentBadgesActionOptions +
                        (showPrices ? " " + style.active : "")
                      }
                    >
                      <article onClick={() => handleAddBadge("GOLD")}>
                        <Image
                          width={28}
                          height={29.5}
                          src={goldLike}
                          alt="Złota Dzida"
                        />
                        <div>
                          <span>1000</span>
                          <Image
                            width={14}
                            height={14}
                            src={coin}
                            alt="Moneta"
                          />
                        </div>
                      </article>
                      <article onClick={() => handleAddBadge("SILVER")}>
                        <Image
                          width={28}
                          height={29.5}
                          src={silverLike}
                          alt="Srebrna Dzida"
                        />
                        <div>
                          <span>400</span>{" "}
                          <Image
                            width={14}
                            height={14}
                            src={coin}
                            alt="Moneta"
                          />
                        </div>
                      </article>
                      <article onClick={() => handleAddBadge("ROCK")}>
                        <Image
                          width={28}
                          height={29.5}
                          src={rockLike}
                          alt="Kamienna Dzida"
                        />
                        <div>
                          <span>100</span>{" "}
                          <Image
                            width={14}
                            height={14}
                            src={coin}
                            alt="Moneta"
                          />
                        </div>
                      </article>
                    </div>
                  </div>
                </div>
                <button
                  className={
                    style.commentReplyA +
                    (isFavourite ? " " + style.isFavouriteComment : "")
                  }
                  onClick={() => handleAddToFavourites(comment._id)}
                >
                  <span
                    className={style.commentReplyAIcon}
                    style={{ fontSize: "16px" }}
                  >
                    <BsStarFill />
                  </span>
                  <span>Ulubione</span>
                </button>
              </div>
            )}
            {postLink && (
              <Link
                className="get-to-post"
                href={`/obr/${comment.post}/${comment.slug}#${comment._id}`}
              >
                Przejdź do posta
              </Link>
            )}
          </div>
        </article>
      </div>
      {showCommentForm && (
        <CommentForm
          endFunction={endFunction}
          avatar={comment.user.avatar}
          comment={commentText.current}
          commentId={commentId ? commentId : null}
          postId={postId}
          refreshComments={refreshComments}
        />
      )}
    </>
  );
};

export default CommentElement;

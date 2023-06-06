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

const CommentElement = ({
  comment,
  isSubComment,
  postId,
  commentId,
  refreshComments,
}: {
  comment: any;
  isSubComment?: boolean;
  postId: string;
  commentId: string | null;
  refreshComments: any;
}) => {
  const [showPrices, setShowPrices] = useState<boolean>(false);
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
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
    const elements: { textElement: string; nodeElement: string }[] = [];
    const nicknames = text.match(userNamePattern);
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

    return newText;
  };

  return (
    <>
      <div>
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
              src={comment.user.avatar || defaultAvatar}
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
                <div className={style.badgesInfoContainer}></div>
              </div>
              <div className={style.commentScore}>
                <span className={style.commentVote}>
                  <span>+</span>
                </span>
                <span className={style.commentScoreCount}>0</span>
                <span
                  className={style.commentVote + " " + style.commentVoteMinus}
                >
                  <span>-</span>
                </span>
              </div>
            </header>
            <div className={style.commentText}>
              <span>
                <div>
                  <div
                    className={style.readMoreContent}
                    style={{ maxHeight: "none" }}
                    dangerouslySetInnerHTML={{
                      __html: parseBBcode(comment.text),
                    }}
                  ></div>
                </div>
              </span>
            </div>
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
                className={style.commentReplyA + " " + style.commentReplyABadge}
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
                    <article>
                      <Image
                        width={28}
                        height={29.5}
                        src={goldLike}
                        alt="Złota Dzida"
                      />
                      <div>
                        <span>1000</span>
                        <Image width={14} height={14} src={coin} alt="Moneta" />
                      </div>
                    </article>
                    <article>
                      <Image
                        width={28}
                        height={29.5}
                        src={silverLike}
                        alt="Srebrna Dzida"
                      />
                      <div>
                        <span>400</span>{" "}
                        <Image width={14} height={14} src={coin} alt="Moneta" />
                      </div>
                    </article>
                    <article>
                      <Image
                        width={28}
                        height={29.5}
                        src={rockLike}
                        alt="Kamienna Dzida"
                      />
                      <div>
                        <span>100</span>{" "}
                        <Image width={14} height={14} src={coin} alt="Moneta" />
                      </div>
                    </article>
                  </div>
                </div>
              </div>
              <button className={style.commentReplyA}>
                <span
                  className={style.commentReplyAIcon}
                  style={{ fontSize: "16px" }}
                >
                  <BsStarFill />
                </span>
                <span>Ulubione</span>
              </button>
            </div>
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

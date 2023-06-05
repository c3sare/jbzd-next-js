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
import dzidaLike from "@/images/dzida_icon.svg";
import style from "@/styles/posts.module.css";

const CommentElement = ({
  comment,
  isSubComment,
}: {
  comment: any;
  isSubComment?: boolean;
}) => {
  return (
    <div>
      <a></a>{" "}
      <article
        className={style.comment + (isSubComment ? " " + style.subComment : "")}
      >
        <Link
          href={`/uzytkownik/${comment.author}`}
          className={style.commentAvatar}
        >
          <Image
            src="/images/avatars/default.jpg"
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
                  <Link href={`/uzytkownik/${comment.author}`}></Link>{" "}
                  <span style={{ color: "rgb(139, 216, 43)" }}>
                    {comment.author}
                  </span>
                </span>
                <br />
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
          <p className={style.commentText}>
            <span>
              <div>
                <div
                  className={style.readMoreContent}
                  style={{ maxHeight: "none" }}
                >
                  {comment.text}
                </div>
              </div>
            </span>
          </p>
          <div className={style.commentReply}>
            <a href="" className={style.commentReplyA}>
              <span className={style.commentReplyAIcon}>
                <TiArrowBack />
              </span>
              <span>Odpowiedz</span>
            </a>
            <a href="" className={style.commentReplyA}>
              <span
                className={style.commentReplyAIcon}
                style={{ fontSize: "16px" }}
              >
                <FaQuoteLeft />
              </span>
              <span>Zacytuj</span>
            </a>
            <div
              className={style.commentReplyA + " " + style.commentReplyABadge}
            >
              <div className={style.commentReplyASelector}>
                <Image width={25} src={dzidaLike} alt="Złota Dzida" />
                <span>Nagroda</span>
                <div className={style.contentBadgesActionOptions}>
                  <article>
                    <Image width={25} src={goldLike} alt="Złota Dzida" />
                    <div>
                      <span>1000</span>
                      <Image width={25} src={coin} alt="Moneta" />
                    </div>
                  </article>
                  <article>
                    <Image width={25} src={silverLike} alt="Srebrna Dzida" />
                    <div>
                      <span>400</span>{" "}
                      <Image width={25} src={coin} alt="Moneta" />
                    </div>
                  </article>
                  <article>
                    <Image width={25} src={rockLike} alt="Kamienna Dzida" />
                    <div>
                      <span>100</span>{" "}
                      <Image width={25} src={coin} alt="Moneta" />
                    </div>
                  </article>
                </div>
              </div>
            </div>
            <a href="" className={style.commentReplyA}>
              <span
                className={style.commentReplyAIcon}
                style={{ fontSize: "16px" }}
              >
                <BsStarFill />
              </span>
              <span>Ulubione</span>
            </a>
          </div>
        </div>
      </article>
    </div>
  );
};

export default CommentElement;

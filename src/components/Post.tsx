import style from "@/styles/posts.module.css";
import alongAgo from "@/utils/alongAgoFunction";
import { FaComment, FaStar, FaCaretUp } from "react-icons/fa";
import fingerLike from "@/images/likes/like_mid_finger.png";
import rockLike from "@/images/likes/like_rock.png";
import silverLike from "@/images/likes/like_silver.png";
import goldLike from "@/images/likes/like_gold.png";
import coins from "@/images/likes/coins.png";
import coin from "@/images/coin.png";
import Link from "next/link";
import avatar from "@/images/avatars/default.jpg";
import Image from "next/image";
import { useState } from "react";

const Post = (props: any) => {
  const { post } = props;
  const [showButtons, setShowButtons] = useState(false);
  return (
    <div className={style.post} key={post.id}>
      <div className={style.avatar}>
        <Link href={`/user/${post.userId}/${encodeURI(post.userName)}`}>
          <Image src={avatar} alt="Avatar" />
        </Link>
      </div>
      <div className={style.contentPost}>
        <div className={style.postHeader}>
          <h2>{post.title}</h2>
          <span className={style.iconComments}>
            <FaComment />
            {post.comments.length}
          </span>
        </div>
        <div className={style.memDetails}>
          <div className={style.userAddTimeDetails}>
            <span className={style.userName}>{post.userName}</span>
            <span className={style.addTime}>{alongAgo(post.addDate)}</span>
            {post.category !== "" && (
              <Link
                href={`/kategoria/${post.category.toLowerCase()}`}
                style={{ color: "#bd3c3c" }}
              >
                {post.category}
              </Link>
            )}
          </div>
          <div className={style.otherLikes}>
            <div className={style.likeContainer}>
              <div className={style.image}>
                <Image width={25} src={fingerLike} alt="Wypierdalajka" />
                <span>Wypierdalajka</span>
              </div>
              <span>{post.mid_finger_like}</span>
            </div>
            <div className={style.likeContainer}>
              <div className={style.image}>
                <Image width={25} src={rockLike} alt="Kamienna Dzida" />
                <span>Kamienna&nbsp;Dzida</span>
              </div>
              <span>{post.rock_like}</span>
            </div>
            <div className={style.likeContainer}>
              <div className={style.image}>
                <Image width={25} src={silverLike} alt="Srebrna Dzida" />
                <span>Srebrna&nbsp;Dzida</span>
              </div>
              <span>{post.silver_like}</span>
            </div>
            <div className={style.likeContainer}>
              <div className={style.image}>
                <Image width={25} src={goldLike} alt="Złota Dzida" />
                <span>Złota&nbsp;Dzida</span>
              </div>
              <span>{post.gold_like}</span>
            </div>
          </div>
        </div>
        <Image src={post.img} width={500} height={500} alt={post.title} />
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
        {showButtons && (
          <div className={style.buttonsCoins}>
            <button>
              <Image src={fingerLike} width={25} alt="Wypierdalajka" />
              <span>
                420
                <Image src={coin} width={15} alt="Moneta" />
              </span>
            </button>
            <button>
              <Image src={goldLike} width={25} alt="Złota Dzida" />
              <span>
                1000
                <Image src={coin} width={15} alt="Moneta" />
              </span>
            </button>
            <button>
              <Image src={silverLike} width={25} alt="Srebrna Dzida" />
              <span>
                400
                <Image src={coin} width={15} alt="Moneta" />
              </span>
            </button>
            <button>
              <Image src={rockLike} width={25} alt="Kamienna Dzida" />
              <span>
                100
                <Image src={coin} width={15} alt="Moneta" />
              </span>
            </button>
          </div>
        )}
        <button
          className={style.coins}
          onClick={() => setShowButtons(!showButtons)}
        >
          <FaCaretUp
            style={showButtons ? { transform: "rotate(180deg)" } : {}}
          />
          <Image width={25} src={coins} alt="Monety" />
        </button>
        <button>
          <FaComment />
        </button>
        <button className={style.star}>
          <FaStar />
        </button>
        <span>+{post.likes}</span>
        <button className={style.plus}>+</button>
        {/* class added - active */}
      </div>
    </div>
  );
};

export default Post;

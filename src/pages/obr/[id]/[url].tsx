import Link from "next/link";
import avatar from "@/images/avatars/default.jpg";
import alongAgo from "@/utils/alongAgoFunction";
import posts from "@/data/posts";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import style from "@/styles/posts.module.css";

const Index = () => {
  const router = useRouter();
  const { id, url } = router.query;
  console.log(encodeURI(String(url).toLowerCase()));
  console.log(
    encodeURI(
      String(posts.find((item) => item.id === Number(id))?.title.toLowerCase())
    )
  );

  const post = posts.find(
    (item) =>
      item.id === Number(id) &&
      encodeURI(String(url).toLowerCase()) ===
        encodeURI(item.title.toLowerCase())
  );
  useEffect(() => {
    if (!post) router.push("/404");
    else document.title = "Jbzd.com.pl - " + post.title;
    // eslint-disable-next-line
  }, []);

  return (
    <div className={style.post}>
      <div className={style.avatar}>
        <Link
          href={`/user/${post?.userId}/${encodeURI(String(post?.userName))}`}
        >
          <Image src={avatar} alt="Avatar" />
        </Link>
      </div>
      <div className={style.contentPost}>
        <h2>{post?.title}</h2>
        <p>
          {alongAgo(String(post?.addDate))}{" "}
          <Link
            href={`/kategoria/${post?.category.toLowerCase()}`}
            style={{ color: "#bd3c3c" }}
          >
            {post?.category}
          </Link>
        </p>
        {post ? <Image src={post?.img} alt={post?.title} /> : null}
        <div className={style.comments}>
          {post?.comments.map((comment) => (
            <div className={style.comment} key={comment.id}>
              <span>
                <Link href={`/users/${comment.userId}`}>
                  {comment.userName}
                </Link>
                <br />
                {comment.text}
              </span>
              <div className={style.likes}>
                <button>+</button>
                <span>{comment.likes}</span>
                <button>-</button>
              </div>
              <div className={style.subComments}>
                {comment.subcomments.map((subcomment) => (
                  <div className={style.subComment} key={subcomment.id}>
                    <p>{subcomment.text}</p>
                    <div className={style.subLikes}>
                      <button>+</button>
                      <span>{comment.likes}</span>
                      <button>-</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Index;

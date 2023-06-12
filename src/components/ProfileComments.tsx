import Loading from "./Loading";
import useSWR from "swr";
import style from "@/styles/posts.module.css";
import CommentElement from "./CommentElement";
import { useState } from "react";

const ProfileComments = ({ username }: { username: string }) => {
  const [commentSort, setCommentSort] = useState<"best" | "newest">("best");
  const {
    data: comments = [],
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/user/${username}/comments/${commentSort}`, {
    refreshInterval: 0,
  });

  return isLoading ? (
    <Loading />
  ) : error ? (
    <div>
      <p>Wystąpił błąd</p>
      <button onClick={mutate}>Ponów próbę</button>
    </div>
  ) : (
    <div>
      <header className={style.commentsHeader}>
        <span className={style.commentsCount}>
          <span>{comments.length}</span> komentarzy
        </span>
        <div>
          <button
            className={
              style.switch + (commentSort === "best" ? " " + style.active : "")
            }
            onClick={() => setCommentSort("best")}
          >
            najlepsze
          </button>
          <button
            className={
              style.switch +
              (commentSort === "newest" ? " " + style.active : "")
            }
            onClick={() => setCommentSort("newest")}
          >
            najnowsze
          </button>
        </div>
      </header>
      <div className={style.comments}>
        {!isLoading && !error && comments ? (
          comments.map((comment: any) => (
            <div key={comment._id}>
              <CommentElement
                comment={comment}
                postId={comment.post}
                commentId={comment._id}
                refreshComments={mutate}
                postLink
              />
            </div>
          ))
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default ProfileComments;

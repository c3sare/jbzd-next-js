import Loading from "./Loading";
import style from "@/styles/posts.module.css";
import useSWR from "swr";
import CommentElement from "./CommentElement";
import { useState } from "react";

const Comments = ({
  id,
  commentsCount,
}: {
  id: string;
  commentsCount: number;
}) => {
  const [commentSort, setCommentSort] = useState<"best" | "newest">("best");
  const {
    data: comments,
    error: errorComments,
    isLoading: isLoadingComments,
    mutate: refreshComments,
  } = useSWR<any[]>(`/api/post/${id}/comment/${commentSort}`);

  return (
    <div>
      <header className={style.commentsHeader}>
        <span className={style.commentsCount}>
          <span>{commentsCount}</span> komentarzy
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
        {!isLoadingComments && !errorComments && comments ? (
          comments.map((comment) => (
            <div key={comment._id}>
              <CommentElement
                comment={comment}
                postId={id}
                commentId={comment._id}
                refreshComments={refreshComments}
              />
              {comment.subcomments.map((subcomm: any) => (
                <CommentElement
                  key={subcomm._id}
                  comment={subcomm}
                  postId={id}
                  commentId={comment._id}
                  isSubComment
                  refreshComments={refreshComments}
                />
              ))}
            </div>
          ))
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Comments;

import Loading from "./Loading";
import style from "@/styles/posts.module.css";
import useSWR from "swr";
import { Comment as CommentInterface } from "@/models/Comment";
import CommentElement from "./CommentElement";

const Comments = ({
  id,
  commentsCount,
}: {
  id: string;
  commentsCount: number;
}) => {
  const {
    data: comments,
    error: errorComments,
    isLoading: isLoadingComments,
  } = useSWR<any[]>(`/api/post/${id}/comment`);

  return (
    <div>
      <header className={style.commentsHeader}>
        <span className={style.commentsCount}>
          <span>{commentsCount}</span> komentarzy
        </span>
        <div>
          <a href="" className={style.switch}>
            najlepsze
          </a>
          <a href="" className={style.switch + " " + style.active}>
            najnowsze
          </a>
        </div>
      </header>
      <div className={style.comments}>
        {!isLoadingComments && !errorComments && comments ? (
          comments.map((comment) => (
            <div key={comment._id}>
              <CommentElement comment={comment} />
              {comment.subcomments.map((subcomm: any) => (
                <CommentElement
                  key={subcomm._id}
                  comment={subcomm}
                  isSubComment
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

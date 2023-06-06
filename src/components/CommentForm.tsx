import style from "@/styles/posts.module.css";
import { IoSend } from "react-icons/io5";
import Image from "next/image";
import defAvatar from "@/images/avatars/default.jpg";
import { useContext, useEffect, useRef } from "react";
import createNotifycation from "@/utils/createNotifycation";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";

const CommentForm = ({
  endFunction,
  avatar,
  comment,
  commentId,
  postId,
  refreshComments,
  noFocus = false,
}: {
  endFunction: any;
  avatar: string;
  comment: string;
  commentId?: string | null;
  postId: string;
  refreshComments: any;
  noFocus?: boolean;
}) => {
  const { setNotifys } = useContext(GlobalContext) as GlobalContextInterface;
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current !== null && !noFocus) {
      ref.current.value = comment;
      ref.current.focus();
      ref.current.selectionStart = ref.current.value.length;
    }
  }, [comment]);

  const userAvatar = avatar === "" || !avatar ? defAvatar : avatar;

  const handleAddComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (ref.current!.value.length > 0) {
      const req = await fetch(`/api/post/${postId}/comment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: ref.current!.value,
          commentId: commentId || null,
        }),
      });
      const res = await req.json();

      if (req.status === 200) {
        createNotifycation(setNotifys, "info", "Prawidłowo dodano komentarz!");
        refreshComments();
      } else {
        createNotifycation(setNotifys, "info", res.message);
      }
      ref.current!.value = "";
      endFunction();
    }
  };

  return (
    <form className={style.commentForm}>
      <div
        className={style.vldOverlay + " " + style.isActive}
        style={{ zIndex: "100", display: "none" }}
      >
        <div
          className={style.vldBackground}
          style={{ background: "rgb(0, 0, 0)" }}
        ></div>
        <div className={style.vldIcon}>
          <svg
            viewBox="0 0 38 38"
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            stroke="#929292"
          >
            <g fill="none" fillRule="evenodd">
              <g transform="translate(1 1)" strokeWidth="2">
                <circle strokeOpacity=".25" cx="18" cy="18" r="18"></circle>
                <path d="M36 18c0-9.94-8.06-18-18-18">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 18 18"
                    to="360 18 18"
                    dur="0.8s"
                    repeatCount="indefinite"
                  ></animateTransform>
                </path>
              </g>
            </g>
          </svg>
        </div>
      </div>{" "}
      <Image
        src={userAvatar}
        width={40}
        height={40}
        alt="Avatar"
        className={style.avatarComment}
      />
      <textarea
        placeholder="Wpisz swój komentarz"
        className={style.addComment}
        style={{ resize: "none", height: "41px", overflow: "hidden" }}
        ref={ref}
        onChange={(e) => {
          ref.current?.style.removeProperty("height");
          ref.current!.style.height = e.target.scrollHeight + 5 + "px";
        }}
      ></textarea>
      <button
        type="submit"
        name="submit"
        className={style.btnComment}
        onClick={handleAddComment}
      >
        <IoSend />
      </button>
    </form>
  );
};

export default CommentForm;

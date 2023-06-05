import style from "@/styles/posts.module.css";
import { IoSend } from "react-icons/io5";
import Image from "next/image";
import defAvatar from "@/images/avatars/default.jpg";

const CommentForm = ({ avatar }: { avatar: string }) => {
  const userAvatar = avatar === "" || !avatar ? defAvatar : avatar;

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
            <g fill="none" fill-rule="evenodd">
              <g transform="translate(1 1)" stroke-width="2">
                <circle stroke-opacity=".25" cx="18" cy="18" r="18"></circle>
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
      <Image src={userAvatar} alt="Avatar" className={style.avatarComment} />
      <textarea
        placeholder="Wpisz swój komentarz"
        className={style.addComment}
        style={{ resize: "none", height: "41px", overflow: "hidden" }}
      ></textarea>
      <button type="submit" name="submit" className={style.btnComment}>
        <IoSend />
      </button>
      <input
        data-vv-as="obrazek"
        name="file"
        accept="image/jpeg,image/png,image/gif"
        type="file"
        style={{ display: "none" }}
      />
      <input type="hidden" value="0" />
    </form>
  );
};

export default CommentForm;

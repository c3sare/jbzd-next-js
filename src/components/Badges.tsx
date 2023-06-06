import rockLike from "@/images/likes/like_rock.png";
import silverLike from "@/images/likes/like_silver.png";
import goldLike from "@/images/likes/like_gold.png";
import style from "@/styles/posts.module.css";
import Image from "next/image";

const Badges = ({ badges }: any) => {
  const { rock, silver, gold } = badges;

  return (
    <div className={style.otherLikes}>
      {rock > 0 && (
        <div className={style.likeContainer}>
          <div className={style.image}>
            <Image width={25} src={rockLike} alt="Kamienna Dzida" />
            <span>Kamienna&nbsp;Dzida</span>
          </div>
          <span>{rock}</span>
        </div>
      )}
      {silver > 0 && (
        <div className={style.likeContainer}>
          <div className={style.image}>
            <Image width={25} src={silverLike} alt="Srebrna Dzida" />
            <span>Srebrna&nbsp;Dzida</span>
          </div>
          <span>{silver}</span>
        </div>
      )}
      {gold > 0 && (
        <div className={style.likeContainer}>
          <div className={style.image}>
            <Image width={25} src={goldLike} alt="Złota Dzida" />
            <span>Złota&nbsp;Dzida</span>
          </div>
          <span>{gold}</span>
        </div>
      )}
    </div>
  );
};

export default Badges;

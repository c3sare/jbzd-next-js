import Comment from "@/models/Comment";
import Post from "@/models/Post";
import User from "@/models/User";
import Image from "next/image";
import Link from "next/link";
import style from "@/styles/userprofile.module.css";
import { TfiCup } from "react-icons/tfi";
import { AiFillPicture, AiFillFlag } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import ProfilePosts from "@/components/ProfilePosts";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";

interface ProfileData {
  profile: {
    username: string;
    createDate: string;
    avatar: string;
  };
  comments: number;
  posts: number;
}

const UserProfile = ({ profile, comments, posts }: ProfileData) => {
  const router = useRouter();
  const [tab, setTab] = useState<number>(
    [0, 1].includes(Number(router.query?.tab)) ? Number(router.query?.tab) : 0
  );
  const {
    login: { logged, login },
  } = useContext(GlobalContext) as GlobalContextInterface;

  return (
    <>
      <section className={style.user}>
        <Image
          width={118}
          height={118}
          src={`/images/avatars/${profile.avatar}`}
          alt="Avatar"
          className={style.avatar}
        />
        <div className={style.userInfo}>
          <header>
            <h2>{profile.username}</h2>
          </header>
          <section className={style.userDetails}>
            <div>
              <span>
                <AiFillPicture />
              </span>
              <span>0 / {posts}</span>
            </div>
            <div>
              <span>
                <FaComment />
              </span>
              <span>{comments}</span>
            </div>
            <div>
              <span>
                <AiFillFlag />
              </span>
              <span>{profile.createDate}</span>
            </div>
          </section>
          <div className={style.profileBadges}>
            <div>
              <span>
                <Image
                  src="/images/likes/like_gold.png"
                  alt="Złota dzida"
                  width={28}
                  height={29}
                />{" "}
                0
              </span>
              <span>
                <Image
                  src="/images/likes/like_silver.png"
                  alt="Srebrna dzida"
                  width={28}
                  height={29}
                />{" "}
                0
              </span>
              <span>
                <Image
                  src="/images/likes/like_rock.png"
                  alt="Kamienna dzida"
                  width={28}
                  height={29}
                />{" "}
                0
              </span>
            </div>
          </div>
          <section className={style.userProfileActions}></section>
        </div>
        <div className={style.userRanks}>
          <div className={style.rank}>
            <span>
              <Image
                src="/images/spear.png"
                width={22}
                height={22}
                alt="Dzida"
              />
            </span>
            <span>0</span>
            {login !== profile?.username && logged && (
              <button className={style.userVote}>+</button>
            )}
          </div>
          <Link href="/ranking" className={style.rank}>
            <span>
              <TfiCup />
            </span>
            <span>1</span>
          </Link>
        </div>
      </section>
      <section>
        <section className={style.actions}>
          <button
            className={tab === 0 ? style.active : ""}
            onClick={() => {
              setTab(0);
              router.push("/uzytkownik/" + profile.username + "?tab=0");
            }}
          >
            Dzidy użytkownika
          </button>
          <button
            className={tab === 1 ? style.active : ""}
            onClick={() => {
              setTab(1);
              router.push("/uzytkownik/" + profile.username + "?tab=1");
            }}
          >
            Komentarze użytkownika
          </button>
        </section>
      </section>
      <div>
        <div className={style.breadcrumbs}>
          <span>
            <Link href="/">Strona główna</Link>
          </span>
          <span>
            <Link href={"/uzytkownik/" + profile.username}>
              {profile.username}
            </Link>
          </span>
          <span>{tab === 0 ? "Dzidy" : "Komentarze"}</span>
        </div>
        {tab === 0 && <ProfilePosts username={profile.username} />}
        {tab === 1 && <section></section>}
      </div>
    </>
  );
};

export async function getServerSideProps({ query }: any) {
  const { username } = query;

  const userInfo = await User.findOne({ username });

  if (!userInfo)
    return {
      notFound: true,
    };

  const user = {
    username: userInfo.username,
    createDate: userInfo.createDate,
    avatar: userInfo.avatar,
  };

  const comments = await Comment.count({ author: username });
  const posts = await Post.count({ author: username });

  return {
    props: {
      profile: user,
      comments,
      posts,
    },
  };
}

export default UserProfile;

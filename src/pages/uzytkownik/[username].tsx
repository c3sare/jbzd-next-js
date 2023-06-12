import { Usersprofiles } from "@/models/User";
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
import Head from "next/head";
import { format } from "date-fns";
import dbConnect from "@/lib/dbConnect";
import createNotifycation from "@/utils/createNotifycation";
import { IoMdEye, IoMdEyeOff, IoMdMail } from "react-icons/io";
import Breadcrumb from "@/components/Breadcrumb";
import { withSessionSSR } from "@/lib/AuthSession/session";
import ObservedBlockList from "@/models/ObservedBlockList";
import ProfileComments from "@/components/ProfileComments";

interface ProfileData {
  profile: {
    _id: string;
    username: string;
    createDate: Date;
    avatar: string;
    spears: number;
    rank: number;
    rock: number;
    silver: number;
    gold: number;
    comments: number;
    acceptedPosts: number;
    allPosts: number;
  };
  isBlocked: boolean;
}

const UserProfile = ({ profile, isBlocked }: ProfileData) => {
  const router = useRouter();
  const [spears, setSpears] = useState<number>(profile?.spears || 0);
  const [tab, setTab] = useState<number>(
    [0, 1].includes(Number(router.query?.tab)) ? Number(router.query?.tab) : 0
  );
  const [blocked, setBlocked] = useState<boolean>(isBlocked || false);
  const {
    login: { logged, login },
    setNotifys,
  } = useContext(GlobalContext) as GlobalContextInterface;

  const handleAddSpear = async (username: string) => {
    const req = await fetch(`/api/user/${username}/spear`, {
      method: "POST",
    });

    const res = await req.json();
    if (req.status === 200) {
      setSpears(res.counter);
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
  };

  const handleAddToBlackList = async (username: string) => {
    const req = await fetch("/api/user/lists/user/block", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: username }),
    });

    const res = await req.json();

    if (req.status === 200) {
      if (res.method === "ADD") {
        setBlocked(true);
      } else {
        setBlocked(false);
      }
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
  };

  return (
    <>
      <Head>
        <title>Profil użytkownika {profile.username}</title>
      </Head>
      <section className={style.user}>
        <Image
          width={118}
          height={118}
          src={
            profile.avatar === ""
              ? "/images/avatars/default.jpg"
              : profile.avatar
          }
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
              <span>
                {profile.acceptedPosts} / {profile.allPosts}
              </span>
            </div>
            <div>
              <span>
                <FaComment />
              </span>
              <span>{profile.comments}</span>
            </div>
            <div>
              <span>
                <AiFillFlag />
              </span>
              <span>{format(new Date(profile.createDate), "dd.MM.yyyy")}</span>
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
                {profile.gold}
              </span>
              <span>
                <Image
                  src="/images/likes/like_silver.png"
                  alt="Srebrna dzida"
                  width={28}
                  height={29}
                />{" "}
                {profile.silver}
              </span>
              <span>
                <Image
                  src="/images/likes/like_rock.png"
                  alt="Kamienna dzida"
                  width={28}
                  height={29}
                />{" "}
                {profile.rock}
              </span>
            </div>
          </div>
          <section className={style.userProfileActions}>
            {login !== profile?.username && logged && (
              <>
                <button>
                  <IoMdMail />
                </button>
                <button
                  className={blocked ? style.disabled : ""}
                  onClick={() => handleAddToBlackList(profile.username)}
                >
                  {blocked ? <IoMdEyeOff /> : <IoMdEye />}
                </button>
              </>
            )}
          </section>
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
            <span>{spears}</span>
            {login !== profile?.username && logged && (
              <button
                className={style.userVote}
                onClick={() => handleAddSpear(profile.username)}
              >
                +
              </button>
            )}
          </div>
          <Link href="/ranking" className={style.rank}>
            <span>
              <TfiCup />
            </span>
            <span>{profile.rank}</span>
          </Link>
        </div>
      </section>
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
      <div>
        <Breadcrumb currentNode={tab === 0 ? "Dzidy" : "Komentarze"}>
          <Link href="/">Strona główna</Link>
          <Link href={"/uzytkownik/" + profile.username}>
            {profile.username}
          </Link>
        </Breadcrumb>
        {tab === 0 && <ProfilePosts username={profile.username} />}
        {tab === 1 && <ProfileComments username={profile.username} />}
      </div>
    </>
  );
};

export const getServerSideProps = withSessionSSR(
  async function getServerSideProps({ req, query }): Promise<any> {
    const { username } = query;
    const session = req.session.user;
    await dbConnect();
    const profile: any = await Usersprofiles.findOne({ username });
    let isBlocked = false;

    if (session?.logged && session?.login) {
      isBlocked = Boolean(
        await ObservedBlockList.exists({
          username: session.login,
          type: "USER",
          method: "BLOCK",
          name: username,
        })
      );
    }

    if (!profile)
      return {
        notFound: true,
      };

    return {
      props: {
        profile: JSON.parse(JSON.stringify(profile)),
        isBlocked,
      },
    };
  }
);

export default UserProfile;

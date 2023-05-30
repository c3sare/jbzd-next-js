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
}

const UserProfile = ({ profile }: ProfileData) => {
  const router = useRouter();
  const [spears, setSpears] = useState<number>(profile?.spears || 0);
  const [tab, setTab] = useState<number>(
    [0, 1].includes(Number(router.query?.tab)) ? Number(router.query?.tab) : 0
  );
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
  await dbConnect();
  const profile: any = await Usersprofiles.findOne({ username });

  if (!profile)
    return {
      notFound: true,
    };

  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
}

export default UserProfile;

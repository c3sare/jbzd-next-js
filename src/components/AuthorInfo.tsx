import Link from "next/link";
import { TfiCup } from "react-icons/tfi";
import Image from "next/image";
import style from "@/styles/posts.module.css";
import avatar from "@/images/avatars/default.jpg";
import { useContext, useState } from "react";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import createNotifycation from "@/utils/createNotifycation";

const AuthorInfo = ({ user }: any) => {
  const [spears, setSpears] = useState<number>(user?.spears || 0);
  const [userMethod, setUserMethod] = useState<"" | "FOLLOW" | "BLOCK">(
    user?.method || ""
  );
  const {
    login: { logged, login },
    setNotifys,
  } = useContext(GlobalContext) as GlobalContextInterface;

  const handleClickBlacklist = async (username: string) => {
    const req = await fetch("/api/user/lists/user/block", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: username }),
    });
    const res = await req.json();

    if (req.status === 200) {
      if (res.method === "ADD") setUserMethod("BLOCK");
      else setUserMethod("");
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
  };

  const handleClickObservelist = async (username: string) => {
    const req = await fetch("/api/user/lists/user/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: username }),
    });
    const res = await req.json();

    if (req.status === 200) {
      if (res.method === "ADD") setUserMethod("FOLLOW");
      else setUserMethod("");
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
  };

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

  const userAvatar =
    user?.avatar === "" || !user?.avatar ? avatar : user?.avatar;

  return (
    <div className={style.authorInfo}>
      <div className={style.detailsAvatar}>
        <Image
          alt={user?.username + " avatar"}
          width={45}
          height={45}
          src={userAvatar}
        />
      </div>
      <div className={style.userPostContent}>
        <div className={style.userPostName}>{user?.username}</div>
        <div className={style.userPostInfo}>
          <div>
            <span>
              <Image
                src="/images/spear.png"
                width={22}
                height={22}
                alt="Dzida"
              />
            </span>
            <span>{spears}</span>
            {logged && login !== user?.username && (
              <button
                className={style.userVote}
                onClick={() => handleAddSpear(user?.username)}
              >
                +
              </button>
            )}
          </div>
          <div>
            <span>
              <TfiCup />
            </span>
            <span>{user?.rank}</span>
          </div>
        </div>
        <div className={style.userPostActions}>
          <button
            disabled={user?.username === login}
            className={userMethod === "FOLLOW" ? style.observed : ""}
            onClick={() => handleClickObservelist(user?.username)}
          >
            Obserwuj
          </button>
          <button
            disabled={user?.username === login}
            className={userMethod === "BLOCK" ? style.blacklisted : ""}
            onClick={() => handleClickBlacklist(user?.username)}
          >
            Czarna lista
          </button>
          <Link href={"/uzytkownik/" + user?.username}>Profil</Link>
        </div>
      </div>
    </div>
  );
};

export default AuthorInfo;

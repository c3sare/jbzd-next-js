import style from "@/styles/Layout.module.css";
import Link from "next/link";
import Image from "next/image";
import { AiOutlinePoweroff, AiFillFlag } from "react-icons/ai";
import { BiImage } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { useContext } from "react";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import { format } from "date-fns";
import Loading from "./Loading";
import logout from "@/utils/logout";

const ProfileInfo = ({ login }: { login: string }) => {
  const {
    profileData: {
      isLoadingProfileData: isLoading,
      profileData: data,
      profileDataError: error,
    },
  } = useContext(GlobalContext) as GlobalContextInterface;

  const date = format(
    data?.createDate ? new Date(data?.createDate) : new Date(),
    "dd.MM.yyyy"
  );

  return (
    <div className={style.profile}>
      {!isLoading ? (
        error ? (
          <div>Wystąpił błąd przy pobieraniu!</div>
        ) : (
          <>
            <div className={style.profileInfo}>
              <Link href={"/uzytkownik/" + login}>
                <Image
                  src={
                    data?.avatar === "" || !data?.avatar
                      ? "/images/avatars/default.jpg"
                      : data.avatar
                  }
                  width={118}
                  height={118}
                  alt="Avatar"
                />
              </Link>
              <section className={style.profileInformations}>
                <div className={style.profileHeader}>
                  <span>
                    <Link href={"/uzytkownik/" + login}>{login}</Link>
                    <button onClick={logout}>
                      <AiOutlinePoweroff />
                    </button>
                  </span>
                </div>
                <section className={style.profileDetails}>
                  <p className={style.profileDetail}>
                    <BiImage /> {data.acceptedPosts} / {data.allPosts}
                  </p>
                  <p className={style.profileDetail}>
                    <FaRegComment /> {data.comments}
                  </p>
                  <p className={style.profileDetail}>
                    <AiFillFlag /> {date}
                  </p>
                </section>
              </section>
            </div>
            <section className={style.profileNav}>
              <Link href={"/uzytkownik/" + login}>Mój profil</Link>
              <Link href="/uzytkownik/ustawienia">Ustawienia</Link>
              <Link href="/ulubione">Ulubione</Link>
            </section>
          </>
        )
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;

import style from "@/styles/Layout.module.css";
import Link from "next/link";
import Image from "next/image";
import defaultAvatar from "@/images/avatars/default.jpg";
import { AiOutlinePoweroff, AiFillFlag } from "react-icons/ai";
import { BiImage } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import useSWR from "swr";
import { useContext } from "react";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import { format } from "date-fns";

const ProfileInfo = ({ login }: { login: string }) => {
  const {
    login: { logged },
  } = useContext(GlobalContext) as GlobalContextInterface;
  const { isLoading, data, error } = useSWR(logged ? "/api/profile" : null);

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
                <Image src={defaultAvatar} alt="Avatar" />
              </Link>
              <section className={style.profileInformations}>
                <div className={style.profileHeader}>
                  <span>
                    <Link href={"/uzytkownicy/" + login}>{login}</Link>
                    <Link href="/wyloguj">
                      <AiOutlinePoweroff />
                    </Link>
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
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProfileInfo;

import Navigation from "./Navigation";
import Footer from "./Footer";
import React from "react";
import { CategoryReducer } from "@/context/categories";
import style from "@/styles/Layout.module.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import RemindPasswordForm from "./RemindPasswordForm";
import { LoginContext, LoginReducer } from "@/context/login";
import { NotifyContext } from "@/context/notify";
import Image from "next/image";
import Link from "next/link";
import defaultAvatar from "@/images/avatars/default.jpg";
import { AiOutlinePoweroff, AiFillFlag } from "react-icons/ai";
import { BiImage } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { useRouter } from "next/router";

export default function Layout({ children }: any) {
  const router = useRouter();
  const [currentForm, setCurrentForm] = React.useState(0);
  const dispatch: React.Dispatch<any> = React.useContext(CategoryReducer);
  const { logged, login } = React.useContext(LoginContext);
  const dispatchLogin = React.useContext(LoginReducer);
  const notifys = React.useContext(NotifyContext);

  const forms = [LoginForm, RegisterForm, RemindPasswordForm];

  React.useEffect(() => {
    fetch("/api/categories")
      .then((data) => data.json())
      .then((data) =>
        dispatch({
          type: "ADD",
          categories: [...data],
        })
      );
  }, [dispatch]);

  React.useEffect(() => {
    fetch("/api/checklogin")
      .then((data) => data.json())
      .then((data) => {
        if (data.logged) {
          if (logged !== data.logged) {
            dispatchLogin({ type: "LOGIN", login: data });
          }
        } else {
          if (logged) {
            fetch("/api/logout");
          }
        }
      });
  }, [dispatchLogin, logged, router.pathname]);

  const loginPanel = (
    <div className={style.login}>
      <div className={style.desktop}>
        {React.createElement(forms[currentForm], { setCurrentForm })}
      </div>
    </div>
  );

  return (
    <>
      <Navigation loginPanel={loginPanel} />
      <div className={style.contentWrapper}>
        <main>{children}</main>
        <aside className={style.sidebar}>
          {logged ? (
            <div className={style.profile}>
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
                      <BiImage /> 0 / 0
                    </p>
                    <p className={style.profileDetail}>
                      <FaRegComment /> 0
                    </p>
                    <p className={style.profileDetail}>
                      <AiFillFlag /> 22.04.2023
                    </p>
                  </section>
                </section>
              </div>
              <section className={style.profileNav}>
                <Link href={"/uzytkownik/" + login}>Mój profil</Link>
                <Link href="/uzytkownik/ustawienia">Ustawienia</Link>
                <Link href="/ulubione">Ulubione</Link>
              </section>
            </div>
          ) : (
            loginPanel
          )}
        </aside>
      </div>
      <Footer />
      <div className={style.notifycations}>
        <span>
          {notifys.map((item) => (
            <div
              className={style.notifycationWraper}
              key={item.id}
              onClick={() => item.closeFn()}
            >
              <div className={style.notifyContainer + " " + item.type}>
                {item.text}
              </div>
            </div>
          ))}
        </span>
      </div>
    </>
  );
}

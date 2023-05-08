import Navigation from "./Navigation";
import Footer from "./Footer";
import React from "react";
import style from "@/styles/Layout.module.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import RemindPasswordForm from "./RemindPasswordForm";
import ProfileInfo from "./ProfileInfo";
import useSWR from "swr";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import Head from "next/head";

export default function Layout({ children }: any) {
  const {
    login: { login, logged },
    setLogin,
    notifys,
    setCategories,
  } = React.useContext(GlobalContext) as GlobalContextInterface;
  const { data = { logged: false, login: "" }, mutate } =
    useSWR("/api/checklogin");
  const [currentForm, setCurrentForm] = React.useState(0);

  const forms = [LoginForm, RegisterForm, RemindPasswordForm];

  React.useEffect(() => {
    fetch("/api/categories")
      .then((data) => data.json())
      .then((data) => setCategories(data));
  }, []);

  React.useEffect(() => {
    if (data.logged) setLogin(data);
    else setLogin({ logged: false, login: "" });
  }, [data]);

  const loginPanel = (
    <div className={style.login}>
      <div className={style.desktop}>
        {React.createElement(forms[currentForm], { setCurrentForm, mutate })}
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Jbzd Clone</title>
      </Head>
      <Navigation loginPanel={loginPanel} />
      <div className={style.contentWrapper}>
        <main>{children}</main>
        <aside className={style.sidebar}>
          {logged ? <ProfileInfo login={login} /> : loginPanel}
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

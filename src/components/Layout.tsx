import Navigation from "./Navigation";
import Footer from "./Footer";
import React from "react";
import style from "@/styles/Layout.module.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import RemindPasswordForm from "./RemindPasswordForm";
import ProfileInfo from "./ProfileInfo";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Layout({ children }: any) {
  const router = useRouter();
  const {
    login: { login, logged },
    refreshLogin,
    notifys,
  } = React.useContext(GlobalContext) as GlobalContextInterface;

  const [currentForm, setCurrentForm] = React.useState(0);

  const hideSidebarList = [
    "/logowanie",
    "/uzytkownik/notyfikacje",
    "/wiadomosci-prywatne",
  ];

  const forms = [LoginForm, RegisterForm, RemindPasswordForm];

  const loginPanel = (
    <div className={style.login}>
      <div className={style.desktop}>
        {React.createElement(forms[currentForm], {
          setCurrentForm,
          mutate: refreshLogin,
        })}
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
        {!hideSidebarList.includes(router.asPath) && (
          <aside className={style.sidebar}>
            {logged ? <ProfileInfo login={login} /> : loginPanel}
          </aside>
        )}
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

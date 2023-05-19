import Navigation from "./Navigation";
import Footer from "./Footer";
import React, { useEffect, useState } from "react";
import style from "@/styles/Layout.module.css";
import ProfileInfo from "./ProfileInfo";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import { useRouter } from "next/router";
import LoginPanel from "./LoginPanel";
import CookiePolicy from "./CookiePolicy";
import { hasCookie, setCookie } from "cookies-next";

export default function Layout({ children }: any) {
  const [policy, setPolicy] = useState(false);
  const router = useRouter();
  const {
    login: { login, logged },
    notifys,
  } = React.useContext(GlobalContext) as GlobalContextInterface;

  const hideSidebarList = [
    "/logowanie",
    "/uzytkownik/notyfikacje",
    "/wiadomosci-prywatne",
  ];

  useEffect(() => {
    if (!hasCookie("policy")) setPolicy(true);
  }, []);

  const showSidebar = !hideSidebarList.includes(router.asPath);

  return (
    <>
      <Navigation />
      <div className={style.contentWrapper}>
        <main style={showSidebar ? {} : { border: "none" }}>{children}</main>
        {showSidebar && (
          <aside className={style.sidebar}>
            {logged ? <ProfileInfo login={login} /> : <LoginPanel />}
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
      {policy && (
        <CookiePolicy
          closePolicy={() => {
            setCookie("policy", "on");
            setPolicy(false);
          }}
        />
      )}
    </>
  );
}

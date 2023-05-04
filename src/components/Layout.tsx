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
import ProfileInfo from "./ProfileInfo";
import useSWR from "swr";

export default function Layout({ children }: any) {
  const { data = { logged: false, login: "" }, mutate } =
    useSWR("/api/checklogin");
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
    if (data.logged) dispatchLogin({ type: "LOGIN", login: data });
    else dispatchLogin({ type: "LOGOUT" });
  }, [data, dispatchLogin]);

  const loginPanel = (
    <div className={style.login}>
      <div className={style.desktop}>
        {React.createElement(forms[currentForm], { setCurrentForm, mutate })}
      </div>
    </div>
  );

  return (
    <>
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

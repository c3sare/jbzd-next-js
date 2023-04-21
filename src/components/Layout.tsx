import Navigation from "./Navigation";
import Footer from "./Footer";
import React from "react";
import { CategoryReducer } from "@/context/categories";
import style from "@/styles/Layout.module.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import RemindPasswordForm from "./RemindPasswordForm";

export default function Layout({ children }: any) {
  const [currentForm, setCurrentForm] = React.useState(0);
  const dispatch: React.Dispatch<any> = React.useContext(CategoryReducer);

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

  return (
    <>
      <Navigation />
      <div className={style.contentWrapper}>
        <main>{children}</main>
        <aside className={style.sidebar}>
          <div className={style.login}>
            <div className={style.desktop}>
              {React.createElement(forms[currentForm], { setCurrentForm })}
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </>
  );
}

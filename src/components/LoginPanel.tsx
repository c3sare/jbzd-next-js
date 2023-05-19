import { createElement, useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import RemindPasswordForm from "./RemindPasswordForm";
import style from "@/styles/Layout.module.css";

const LoginPanel = () => {
  const [currentForm, setCurrentForm] = useState(0);

  const forms = [LoginForm, RegisterForm, RemindPasswordForm];
  return (
    <div className={style.login}>
      <div className={style.desktop}>
        {createElement(forms[currentForm], {
          setCurrentForm,
        })}
      </div>
    </div>
  );
};

export default LoginPanel;

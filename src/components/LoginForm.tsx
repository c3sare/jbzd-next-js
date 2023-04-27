import { LoginReducer } from "@/context/login";
import { NotifyReducer } from "@/context/notify";
import style from "@/styles/Layout.module.css";
import createNotifycation from "@/utils/createNotifycation";
import Link from "next/link";
import { useContext } from "react";
import { useForm } from "react-hook-form";

export default function LoginForm({ setCurrentForm }: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const dispatchNotify = useContext(NotifyReducer);
  const loginDispatch = useContext(LoginReducer);

  const sendData = async (data: any) => {
    const fetcher = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await fetcher.json();

    if (fetcher.status === 200) {
      loginDispatch({ type: "LOGIN", login: res });
      createNotifycation(dispatchNotify, "info", "Pomyślnie zalogowano!");
    } else {
      if (fetcher.status === 403) {
        setError("login", {
          type: "custom",
          message: "Nieprawidłowe dane logowania!",
        });
        setError("password", {
          type: "custom",
          message: "Nieprawidłowe dane logowania!",
        });
      } else if (fetcher.status === 500) {
        createNotifycation(dispatchNotify, "info", res.message);
      }
    }
  };

  return (
    <form className={style.loginForm} onSubmit={handleSubmit(sendData)}>
      <div className={style.formGroup}>
        <input
          className={errors.login ? style.errorInput : ""}
          type="text"
          placeholder="Podaj nick lub email"
          {...register("login", {
            required: "Podaj login lub email!",
            pattern: {
              value:
                /^(?:[A-Z\d][A-Z\d_-]{5,10}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i,
              message: "Nieprawidłowy nick lub email!",
            },
          })}
        />
        {errors.login && (
          <span className={style.error}>{errors.login?.message as string}</span>
        )}
      </div>
      <div className={style.formGroup}>
        <input
          className={errors.password ? style.errorInput : ""}
          type="password"
          placeholder="Hasło"
          {...register("password", {
            required: "Wprowadź hasło!",
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
              message: "Nieprawidłowe hasło!",
            },
          })}
        />
        {errors.password && (
          <span className={style.error}>
            {errors.password?.message as string}
          </span>
        )}
      </div>
      <div className={style.formButtons}>
        <div className={style.buttonGroup}>
          <button className={style.buttonSubmit} type="submit">
            Zaloguj się
          </button>
        </div>
      </div>
      <div className={style.formGroupLinks}>
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setCurrentForm(2);
          }}
        >
          Przypomnij hasło
        </Link>
        <Link
          href="/"
          style={{ color: "white" }}
          onClick={(e) => {
            e.preventDefault();
            setCurrentForm(1);
          }}
        >
          Zarejestruj się
        </Link>
      </div>
    </form>
  );
}

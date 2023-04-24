import { NotifyContext, NotifyReducer } from "@/context/notify";
import style from "@/styles/Layout.module.css";
import createNotifycation from "@/utils/createNotifycation";
import Link from "next/link";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  repassword: string;
  rules: boolean;
}

export default function RegisterForm({ setCurrentForm }: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    clearErrors,
    setError,
  } = useForm<RegisterForm>();
  const notifyDispatch = useContext(NotifyReducer);

  const sendFormData = async (data: RegisterForm) => {
    setLoading(true);
    const fetcher = await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (fetcher.status === 200) {
      setCurrentForm(0);
      createNotifycation(
        notifyDispatch,
        "info",
        "Konto zostało utworzone, potwierdź utworzenie przez podany adres e-mail!"
      );
    } else {
      setLoading(false);
      if (fetcher.status === 409) {
        const data = await fetcher.json();
        setError(
          data.field,
          { type: "custom", message: data.message },
          { shouldFocus: true }
        );
      }
    }
  };

  return (
    <form className={style.loginForm} onSubmit={handleSubmit(sendFormData)}>
      <div className={style.formGroup}>
        <input
          type="text"
          autoComplete="off"
          disabled={loading}
          placeholder="Nazwa użytkownika"
          {...register("username", {
            required: "To pole jest wymagane!",
            pattern: {
              value: /[a-z]?(.|\-)+(\w+|\b)/,
              message: "Nieprawidłowa nazwa użytkownika!",
            },
          })}
          className={errors.username ? style.errorInput : ""}
        />
        {errors.username && (
          <span className={style.error}>
            {errors.username.message as string}
          </span>
        )}
      </div>
      <div className={style.formGroup}>
        <input
          type="text"
          placeholder="Email"
          autoComplete="off"
          disabled={loading}
          {...register("email", {
            required: "To pole jest wymagane!",
            pattern: {
              value:
                /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
              message: "Nieprawidłowy adres e-mail!",
            },
          })}
          className={errors.email ? style.errorInput : ""}
        />
        {errors.email && (
          <span className={style.error}>{errors.email.message as string}</span>
        )}
      </div>
      <div className={style.formGroup}>
        <input
          type="password"
          placeholder="Hasło"
          disabled={loading}
          {...register("password", {
            required: "To pole jest wymagane!",
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
              message: "Hasło musi zawierać 8 znaków, 1 literę i 1 cyfrę!",
            },
            validate: (val) => {
              if (val === getValues("repassword")) {
                clearErrors("repassword");
                return true;
              } else return "Hasła nie są identyczne!";
            },
          })}
          className={errors.password ? style.errorInput : ""}
        />
        {errors.password && (
          <span className={style.error}>
            {errors.password.message as string}
          </span>
        )}
      </div>
      <div className={style.formGroup}>
        <input
          type="password"
          placeholder="Powtórz hasło"
          disabled={loading}
          {...register("repassword", {
            required: "To pole jest wymagane!",
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
              message: "Hasło musi zawierać 8 znaków, 1 literę i 1 cyfrę!",
            },
            validate: (val) => {
              if (val === getValues("password")) {
                clearErrors("password");
                return true;
              } else return "Hasła nie są identyczne!";
            },
          })}
          className={errors.repassword ? style.errorInput : ""}
        />
        {errors.repassword && (
          <span className={style.error}>
            {errors.repassword.message as string}
          </span>
        )}
      </div>
      <div
        className={
          style.formGroupCheckbox + (errors.rules ? " " + style.errorInput : "")
        }
      >
        <input
          id="rules"
          type="checkbox"
          disabled={loading}
          {...register("rules", {
            required: "Musisz zaakceptować regulamin!",
          })}
        />
        <label htmlFor="rules" className={style.formLabel}>
          Akceptuję{" "}
          <a href="/regulamin" target="_blank">
            regulamin
          </a>
        </label>
        {errors.rules && (
          <span className={style.error}>{errors.rules.message as string}</span>
        )}
      </div>
      <div className={style.formButtons}>
        <div className={style.buttonGroup}>
          <button
            className={style.buttonSubmit}
            type="submit"
            disabled={loading}
          >
            Zarejestuj się
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
            setCurrentForm(0);
          }}
        >
          Zaloguj się
        </Link>
      </div>
    </form>
  );
}

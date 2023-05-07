import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import style from "@/styles/Layout.module.css";
import createNotifycation from "@/utils/createNotifycation";
import Link from "next/link";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

export default function RemindPasswordForm({ setCurrentForm }: any) {
  const [step, setStep] = useState(1);

  switch (step) {
    case 1: {
      return <StepOne setCurrentForm={setCurrentForm} setStep={setStep} />;
    }
    case 2: {
      return <StepTwo setCurrentForm={setCurrentForm} />;
    }

    default: {
      return <span>Nieprawidłowy parametr!</span>;
    }
  }
}

const StepOne = ({ setCurrentForm, setStep }: any) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { setNotifys } = useContext(GlobalContext) as GlobalContextInterface;

  const sendData = async (data: any) => {
    const fetcher = await fetch("/api/users/changepwd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (fetcher.status === 200) {
      setStep(2);
      createNotifycation(
        setNotifys,
        "info",
        "Na podany adres e-mail został wysłany klucz zmiany hasła!"
      );
    } else {
      const data = await fetcher.json();
      createNotifycation(setNotifys, "info", data.message);
    }
  };

  return (
    <form className={style.loginForm} onSubmit={handleSubmit(sendData)}>
      <div className={style.formGroup}>
        <input
          type="text"
          placeholder="Adres email"
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
      <div className={style.formButtons}>
        <div className={style.buttonGroup}>
          <button className={style.buttonSubmit} type="submit">
            Wyślij link resetujący hasło
          </button>
        </div>
      </div>
      <div className={style.formGroupLinks}>
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setCurrentForm(1);
          }}
        >
          Zarejestruj się
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
};

interface ChangePWDInterface {
  token: string;
  password: string;
  repassword: string;
}

const StepTwo = ({ setCurrentForm }: any) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
  } = useForm<ChangePWDInterface>({ defaultValues: { token: "" } });

  const { setNotifys } = useContext(GlobalContext) as GlobalContextInterface;

  const sendData = async (data: any) => {
    const fetcher = await fetch("/api/users/changepwd", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (fetcher.status === 200) {
      createNotifycation(
        setNotifys,
        "info",
        "Hasło zostało pomyślnie zmienione!"
      );
      setCurrentForm(0);
    } else {
      createNotifycation(
        setNotifys,
        "info",
        "Wystąpił problem przy zmianie hasła!"
      );
    }
  };

  const token = watch("token");

  const showFields = token.length === 18;

  return (
    <form className={style.loginForm} onSubmit={handleSubmit(sendData)}>
      <div className={style.formGroup}>
        <input
          type="text"
          placeholder="TOKEN"
          {...register("token", {
            required: "Nieprawidłowy token!",
            minLength: {
              value: 18,
              message: "Nieprawidłowy token!",
            },
            maxLength: {
              value: 18,
              message: "Nieprawidłowy token!",
            },
          })}
          className={errors.token ? style.errorInput : ""}
        />
        {errors.token && (
          <span className={style.error}>{errors.token.message as string}</span>
        )}
      </div>
      {showFields && (
        <>
          <div className={style.formGroup}>
            <input
              type="text"
              placeholder="Hasło"
              {...register("password", {
                required: "To pole jest wymagane!",
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                  message: "Haslo musi mieć 8 znaków, 1 cyfrę i 1 literę!",
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
              type="text"
              placeholder="Powtórz hasło"
              {...register("repassword", {
                required: "To pole jest wymagane!",
                validate: (val) => {
                  if (val !== getValues("password")) {
                    return "Hasła nie są identyczne!";
                  } else {
                    return true;
                  }
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
          <div className={style.formButtons}>
            <div className={style.buttonGroup}>
              <button className={style.buttonSubmit} type="submit">
                Zmień hasło
              </button>
            </div>
          </div>
        </>
      )}
      <div className={style.formGroupLinks}>
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setCurrentForm(1);
          }}
        >
          Zarejestruj się
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
};

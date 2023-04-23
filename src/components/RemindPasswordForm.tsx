import style from "@/styles/Layout.module.css";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function RemindPasswordForm({ setCurrentForm }: any) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  return (
    <form
      className={style.loginForm}
      onSubmit={handleSubmit((data) => console.log(data))}
    >
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
}

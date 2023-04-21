import style from "@/styles/Layout.module.css";
import Link from "next/link";

export default function RemindPasswordForm({ setCurrentForm }: any) {
  return (
    <form className={style.loginForm}>
      <div className={style.formGroup}>
        <input type="text" placeholder="Adres email" />
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

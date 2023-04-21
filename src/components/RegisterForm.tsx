import style from "@/styles/Layout.module.css";
import Link from "next/link";

export default function RegisterForm({ setCurrentForm }: any) {
  return (
    <form className={style.loginForm}>
      <div className={style.formGroup}>
        <input type="text" placeholder="Nazwa użytkownika" />
      </div>
      <div className={style.formGroup}>
        <input type="text" placeholder="Email" />
      </div>
      <div className={style.formGroup}>
        <input type="password" placeholder="Hasło" />
      </div>
      <div className={style.formGroup}>
        <input type="password" placeholder="Powtórz hasło" />
      </div>
      <div className={style.formGroupCheckbox}>
        <input name="rules" id="rules" type="checkbox" />
        <label htmlFor="rules" className={style.formLabel}>
          Akceptuję{" "}
          <a href="/regulamin" target="_blank">
            regulamin
          </a>
        </label>
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
            setCurrentForm(0);
          }}
        >
          Zaloguj się
        </Link>
      </div>
    </form>
  );
}

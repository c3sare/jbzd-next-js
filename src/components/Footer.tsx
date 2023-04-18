import style from "@/styles/footer.module.css";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className={style.footer}>
      <Link href="/regulamin">Regulamin</Link>
      {" | "}
      <Link href="/kontakt">Kontakt</Link>
      {" | "}
      <Link href="/polityka-prywatnosci">Polityka Prywatności</Link>
      {" | "}
      <Link href="/changelog">Dziennik zmian</Link>
    </footer>
  );
};

export default Footer;

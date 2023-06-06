import { FaQuoteLeft } from "react-icons/fa";
import style from "@/styles/posts.module.css";

const Quote = ({ children }: any) => {
  return (
    <blockquote className={style.quote}>
      <FaQuoteLeft />
      {children}
      <FaQuoteLeft />
    </blockquote>
  );
};

export default Quote;

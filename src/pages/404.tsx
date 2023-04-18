import Image from "next/image";
import err from "../images/404.png";

const ErrorPage = () => {
  return (
    <div className="errorPage">
      <h3>Błąd 404</h3>
      <Image src={err} alt="Strony nie znaleziono" />
    </div>
  );
};

export default ErrorPage;

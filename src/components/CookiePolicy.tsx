import Image from "next/image";
import style from "@/styles/cookiepolicy.module.css";

const CookiePolicy = ({ closePolicy }: any) => {
  const handleAcceptPolicy = () => {
    closePolicy();
  };

  return (
    <div className={style.cookiePolicy}>
      <div className={style.withGrid}>
        <div className={style.zeroLayer}>
          <div>
            <Image src="/images/logo.png" alt="logo" height={36} width={48} />
          </div>
          <p className={style.title} style={{ color: "rgb(226, 35, 39)" }}>
            Dbamy o Twoją prywatność
          </p>
          <div className={style.text}>
            <p>
              <span style={{ color: "rgb(232, 232, 232)" }}>My i </span>
              <span
                role="button"
                tabIndex={0}
                style={{
                  color: "rgb(158, 167, 217)",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                nasi partnerzy
              </span>
              <span style={{ color: "rgb(232, 232, 232)" }}>
                {" "}
                uzyskujemy dostęp i przechowujemy informacje na urządzeniu oraz
                przetwarzamy dane osobowe, takie jak unikalne identyfikatory i
                standardowe informacje wysyłane przez urządzenie czy dane
                przeglądania w celu wyboru oraz tworzenia profilu
                spersonalizowanych treści i reklam, pomiaru wydajności treści i
                reklam, a także rozwijania i ulepszania produktów. Za zgodą
                użytkownika my i
              </span>
              <span style={{ color: "rgb(232, 232, 232)" }}>
                nasi partnerzy
              </span>
              <span style={{ color: "rgb(232, 232, 232)" }}>
                możemy korzystać z precyzyjnych danych geolokalizacyjnych oraz
                identyfikację poprzez skanowanie urządzeń.
              </span>
            </p>
            <p>
              <span style={{ color: "rgb(232, 232, 232)" }}>
                Kliknięcie w przycisk poniżej pozwala na wyrażenie zgody na
                przetwarzanie danych przez nas i{" "}
              </span>
              <span style={{ color: "rgb(232, 232, 232)" }}>
                naszych partnerów
              </span>
              <span style={{ color: "rgb(232, 232, 232)" }}>
                , zgodnie z opisem powyżej. Możesz również uzyskać dostęp do
                bardziej szczegółowych informacji i zmienić swoje preferencje
                zanim wyrazisz zgodę lub odmówisz jej wyrażenia. Niektóre
                rodzaje przetwarzania danych nie wymagają zgody użytkownika, ale
                masz prawo sprzeciwić się takiemu przetwarzaniu. Preferencje nie
                będą miały zastosowania do innych witryn posiadających zgodę
                globalną lub serwisową.
              </span>
            </p>
          </div>
          <div className={style.buttons}>
            <button className={style.red} onClick={handleAcceptPolicy}>
              Zaakceptuj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;

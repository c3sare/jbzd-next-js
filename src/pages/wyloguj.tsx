import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import { withSessionSSR } from "@/lib/AuthSession/session";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

export default function Wyloguj({ logout, message }: any) {
  const router = useRouter();
  const [time, setTime] = useState(5);
  const { refreshLogin } = useContext(GlobalContext) as GlobalContextInterface;

  useEffect(() => {
    if (logout) {
      refreshLogin();
    }

    const interval = setInterval(() => {
      setTime((prev: number) => {
        if (prev > 1) return prev - 1;
        else {
          clearInterval(interval);
          router.push("/");
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <span>
        {message}
        <br />
        Za {time} sekundy zostaniesz przeniesiony!
      </span>
    </>
  );
}

export const getServerSideProps = withSessionSSR(
  async function getServerSideProps({ req }: any) {
    const session = req.session.user;
    if (!session?.logged && (session?.login === "" || !session?.login))
      return {
        props: {
          logout: false,
          message: "Nie jesteś zalogowany!",
        },
      };

    req.session.destroy();
    return {
      props: { logout: true, message: "Prawidłowo wylogowano!" },
    };
  }
);

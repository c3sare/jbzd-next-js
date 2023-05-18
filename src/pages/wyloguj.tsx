import { withSessionSSR } from "@/lib/AuthSession/session";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Wyloguj({ logout, message }: any) {
  const router = useRouter();

  useEffect(() => {
    if (logout) {
      router.push("/");
    }

    return () => router.reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <span></span>
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

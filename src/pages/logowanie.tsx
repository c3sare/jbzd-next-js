import LoginPanel from "@/components/LoginPanel";
import Seo from "@/components/Seo";
import { withSessionSSR } from "@/lib/AuthSession/session";

const Login = () => {
  return (
    <>
      <Seo subTitle=", logowanie" />
      <h1>Logowanie</h1>
      <LoginPanel />
    </>
  );
};

export default Login;

export const getServerSideProps = withSessionSSR(
  async function getServerSideProps({ req }): Promise<any> {
    if (req.session.user?.logged || req.session.user?.login)
      return {
        redirect: {
          destination: "/",
          permament: false,
        },
      };

    return {
      props: {},
    };
  }
);

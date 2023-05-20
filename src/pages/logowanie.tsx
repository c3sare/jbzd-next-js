import LoginPanel from "@/components/LoginPanel";
import Seo from "@/components/Seo";

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

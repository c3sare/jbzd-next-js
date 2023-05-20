import Seo from "@/components/Seo";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ConfirmAccount = ({ confirmed }: { confirmed: boolean }) => {
  const router = useRouter();

  useEffect(() => {
    let timeout = setTimeout(() => {
      router.push("/logowanie");
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Seo subTitle=", potwierdzenie konta" />
      <h1>Potwierdzenie konta</h1>
      <p>
        {confirmed
          ? "Twoje konto zostało potwierdzone!"
          : "Nie udało się potwierdzić konta!"}
      </p>
    </>
  );
};

export async function getServerSideProps({ req, query }: any) {
  await dbConnect();
  const user = await User.collection.updateOne(
    { token: query.token as string, confirmed: false },
    { $set: { token: "", confirmed: true } }
  );

  console.log(user);

  return {
    props: {
      confirmed: user.modifiedCount === 1,
    },
  };
}
export default ConfirmAccount;

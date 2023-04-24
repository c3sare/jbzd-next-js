import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const ConfirmAccount = ({ confirmed }: { confirmed: boolean }) => {
  return (
    <>
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

import Post from "@/components/Post";
import { sessionOptions } from "@/lib/AuthSession/config";
import Favourite from "@/models/Favourite";
import Posts from "@/models/Post";
import { withIronSessionSsr } from "iron-session/next";
import { Types } from "mongoose";

const Upload = ({ favourites }: any) => {
  return (
    <>
      <h1>Ulubione</h1>
      {favourites.map((post: any) => (
        <Post post={post} />
      ))}
    </>
  );
};

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }: any) {
    const session = req.session?.user;

    if (!session?.logged || !session?.login)
      return {
        notFound: true,
      };

    const favourites = (
      await Favourite.collection.find({ username: session.login }).toArray()
    ).map((item) => new Types.ObjectId(item.post));

    if (!favourites || favourites.length === 0)
      return {
        props: {
          favourites: [],
        },
      };

    const posts = await Posts.collection
      .find({
        _id: { $in: favourites },
      })
      .toArray();

    return {
      props: { favourites: JSON.parse(JSON.stringify(posts)) },
    };
  },
  sessionOptions
);

export default Upload;

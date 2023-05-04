import Comment from "@/models/Comment";
import Post from "@/models/Post";
import User from "@/models/User";
import Image from "next/image";

interface ProfileData {
  profile: {
    username: string;
    createDate: string;
    avatar: string;
  };
  comments: number;
  posts: number;
}

const UserProfile = ({ profile, comments, posts }: ProfileData) => {
  return (
    <div>
      <Image
        width={118}
        height={118}
        src={`/images/avatars/${profile.avatar}`}
        alt="Avatar"
      />
      <p>
        <b>{profile.username}</b>
      </p>
      <p>Data utworzenia: {profile.createDate}</p>
      <p>Komentarze: {comments}</p>
      <p>Posty: {posts}</p>
    </div>
  );
};

export async function getServerSideProps({ query }: any) {
  const { username } = query;

  const userInfo = await User.findOne({ username });

  if (!userInfo)
    return {
      notFound: true,
    };

  const user = {
    username: userInfo.username,
    createDate: userInfo.createDate,
    avatar: userInfo.avatar,
  };

  const comments = await Comment.count({ author: username });
  const posts = await Post.count({ author: username });

  return {
    props: {
      profile: user,
      comments,
      posts,
    },
  };
}

export default UserProfile;

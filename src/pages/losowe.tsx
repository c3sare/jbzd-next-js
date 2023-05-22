import { Postsstats } from "@/models/Post";
import createSlug from "@/utils/createSlug";

export default function RandomPage() {
  return;
}

export async function getServerSideProps() {
  const post = JSON.parse(
    JSON.stringify((await Postsstats.aggregate([{ $sample: { size: 1 } }]))[0])
  );

  const slug = createSlug(post.title);

  return {
    redirect: {
      destination: `/obr/${post._id}/${slug}`,
      permament: false,
    },
  };
}

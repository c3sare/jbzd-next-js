import { withSessionSSR } from "@/lib/AuthSession/session";
import dbConnect from "@/lib/dbConnect";
import Blacklist from "@/models/Blacklist";
import Category from "@/models/Category";
import { Postsstats } from "@/models/Post";
import User from "@/models/User";
import { format } from "date-fns";

interface Options {
  accepted?: boolean;
  author?: {
    $nin?: string[];
  };
  category?: string;
}

const getPosts = (options: Options, asPage: boolean = false) =>
  withSessionSSR(async function getServerSideProps({ req, query }: any) {
    const session = req.session?.user;
    await dbConnect();

    const page = Number(query.page || 1);
    const category = query.category;

    if (Number.isNaN(page) || category !== undefined) {
      console.log("isNan: " + Number.isNaN(page));
      console.log("category: " + category);
      if (category?.length > 0) {
      } else
        return {
          notFound: true,
        };
    }

    let findOptions: Options = options;

    if (category) {
      const checkCategory = await Category.findOne({
        slug: category,
        asPage,
      });
      if (!checkCategory)
        return {
          notFound: true,
        };

      if (!session?.logged || !session?.login)
        return {
          redirect: {
            destination: "/logowanie",
            permament: false,
          },
        };
      else {
        options.category = category;
      }
    }

    if (session?.logged && session?.login) {
      findOptions.author = {
        $nin: (await Blacklist.find({ username: session?.login })).map(
          (item) => item.user
        ),
      };
    }
    const allPosts = await Postsstats.count(findOptions);

    const allPages = Math.ceil(allPosts / 8);

    let posts = await Postsstats.find(findOptions)
      .sort({ addTime: -1 })
      .skip((page - 1) * 8)
      .limit(8);

    if (!session?.logged || !session?.login) {
      posts = posts.map((item) => {
        const newObject = { ...item._doc };
        delete newObject.user;
        return newObject;
      });
    }

    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
        currentPage: page,
        allPages,
      },
    };
  });

export default getPosts;

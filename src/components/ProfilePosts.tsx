import style from "@/styles/userprofile.module.css";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Post from "./Post";
import Loading from "./Loading";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";

const ProfilePosts = ({ username }: { username: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [category, setCategory] = useState<string>("all");
  const { categories } = useContext(GlobalContext) as GlobalContextInterface;
  const [posts, setPosts] = useState<any[]>([]);

  const categoriesSelect = categories
    ? categories.filter((item) => !item.nsfw && !item.asPage)
    : [];

  useEffect(() => {
    if (categories !== null) {
      if (
        categories
          .filter((item) => !item.nsfw && !item.asPage)
          .filter((item) => item.slug === router.query.category).length > 0 &&
        router.query?.category
      )
        setCategory(router.query.category as string);
    }
  }, [categories, router]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/user/${username}/posts/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [category, username]);

  return (
    <>
      <section className={style.posts}>
        <select
          value={category}
          onChange={(e) => {
            router.push(
              "/uzytkownik/" + username + "?tab=0&category=" + e.target.value
            );
            setCategory(e.target.value);
          }}
        >
          <option value="all">Wszystkie kategorie</option>
          {categoriesSelect.map((item, i) => (
            <option key={i} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </section>

      {loading ? (
        <Loading />
      ) : (
        posts.map((item) => <Post key={item._id} post={item} />)
      )}
    </>
  );
};

export default ProfilePosts;

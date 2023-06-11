import style from "@/styles/userprofile.module.css";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Post from "./Post";
import Loading from "./Loading";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import useSWR from "swr";

const ProfilePosts = ({ username }: { username: string }) => {
  const router = useRouter();
  const [category, setCategory] = useState<string>("all");
  const {
    data: posts,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/user/${username}/posts/${category}`, { refreshInterval: 0 });
  const { categories } = useContext(GlobalContext) as GlobalContextInterface;

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

      {isLoading ? (
        <Loading />
      ) : error ? (
        <div>
          <p>Wystąpił błąd</p>
          <button onClick={mutate}>Ponów próbę</button>
        </div>
      ) : (
        posts.map((item: any) => <Post key={item._id} post={item} />)
      )}
    </>
  );
};

export default ProfilePosts;

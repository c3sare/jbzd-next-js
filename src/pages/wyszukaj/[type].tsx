import Search from "@/components/Search";
import Seo from "@/components/Seo";
import searchDatabase from "@/utils/searchDatabase";
import style from "@/styles/search.module.css";
import Link from "next/link";
import slug from "@/utils/createSlug";

const SearchType = ({ boxes }: { boxes: any }) => {
  return (
    <>
      <Seo />
      <h1>Szukaj</h1>
      <Search />
      {boxes?.tagi?.length > 0 && (
        <div className={style.container + " " + style.tags}>
          <h2>Tagi</h2>
          <div>
            {boxes.tagi.map((item: any, i: number) => (
              <Link key={i} href={`/tag/${item}`}>
                #{item}
              </Link>
            ))}
          </div>
        </div>
      )}
      {boxes?.uzytkownicy?.length > 0 && (
        <div className={style.container + " " + style.users}>
          <h2>Użytkownicy</h2>
          <div>
            {boxes.uzytkownicy.map((item: any, i: number) => (
              <div key={i}>{item.username}</div>
            ))}
          </div>
        </div>
      )}
      {boxes?.obrazki?.length > 0 && (
        <div className={style.container + " " + style.images}>
          <h2>Obrazki</h2>
          <div>
            {boxes.obrazki.map((item: any, i: number) => (
              <Link key={i} href={`/obr/${item._id}/${slug(item.title)}`}>
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchType;

export async function getServerSideProps({ query }: { query: any }) {
  if (
    !["wszystko", "obrazki", "tagi", "uzytkownicy"].includes(
      query.type as string
    )
  ) {
    return {
      notFound: true,
    };
  } else {
    if (!query?.pharse || query?.pharse?.length < 3) {
      return {
        props: {
          boxes: [],
        },
      };
    }

    const boxes = JSON.parse(
      JSON.stringify(await searchDatabase(query.type, query.pharse))
    );

    return {
      props: {
        boxes,
      },
    };
  }
}

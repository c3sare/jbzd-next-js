import style from "@/styles/navigation.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdSearch } from "react-icons/md";

interface SearchFormInterface {
  pharse: string;
  search: "wszystko" | "obrazki" | "tagi" | "uzytkownicy";
}

const Search = ({ setShowSearch }: { setShowSearch?: any }) => {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm<SearchFormInterface>({
    defaultValues: {
      search: "wszystko",
      pharse: "",
    },
  });

  useEffect(() => {
    const search = router.query?.type as any;
    const pharse = router.query?.pharse as any;
    if (search) setValue("search", search);

    if (pharse) setValue("pharse", decodeURIComponent(pharse));
  }, [router.query, setValue]);

  const handleSearchForm = (data: SearchFormInterface) => {
    if (setShowSearch) setShowSearch(false);
    const { search, pharse } = data;
    router.push(`/wyszukaj/${search}?pharse=${encodeURIComponent(pharse)}`);
  };

  const search = register("search", {
    required: true,
    validate: (val) =>
      ["wszystko", "obrazki", "tagi", "uzytkownicy"].includes(val),
  });

  const pharse = register("pharse", {
    required: true,
  });

  return (
    <div className={style.search}>
      <div className={style.searchContent}>
        <form onSubmit={handleSubmit(handleSearchForm)}>
          <div className={style.inputs}>
            <input
              type="text"
              placeholder="Wpisz szukaną wartość..."
              {...pharse}
            />
            <button type="submit">
              <MdSearch />
            </button>
          </div>
          <div className={style.searchIn}>
            <div>
              <input
                type="radio"
                value="wszystko"
                id="search-box-type-all"
                {...search}
              />
              <label htmlFor="search-box-type-all">Wszystkie</label>
            </div>
            <div>
              <input
                type="radio"
                value="obrazki"
                id="search-box-type-image"
                {...search}
              />
              <label htmlFor="search-box-type-image">Obrazki</label>
            </div>
            <div>
              <input
                type="radio"
                value="tagi"
                id="search-box-type-tag"
                {...search}
              />
              <label htmlFor="search-box-type-tag">Tagi</label>
            </div>
            <div>
              <input
                type="radio"
                value="uzytkownicy"
                id="search-box-type-user"
                {...search}
              />
              <label htmlFor="search-box-type-user">Użytkownicy</label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Search;

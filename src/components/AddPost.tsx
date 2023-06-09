import style from "@/styles/addpost.module.css";
import { FaRegImage, FaVideo, FaYoutube, FaTrashAlt } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import ImageContainer from "./AddPostComponents/ImageContainer";
import TextContainer from "./AddPostComponents/TextContainer";
import VideoContainer from "./AddPostComponents/VideoContainer";
import YoutubeContainer from "./AddPostComponents/YoutubeContainer";
import { useForm, useFieldArray } from "react-hook-form";
import CheckUrl from "./AddPostComponents/CheckUrl";
import MemContainersSortable from "./MemContainersSortable";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import createNotifycation from "@/utils/createNotifycation";
import { useRouter } from "next/router";
import Loading from "./Loading";

function isValidHttpUrl(link: string) {
  let url;
  try {
    url = new URL(link);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

interface AddPostInterface {
  category: string | null;
  linking: boolean;
  linkingUrl?: string;
  memContainers: {
    data: string | File | null;
    type: "youtube" | "text" | "image" | "video";
  }[];
  tags: {
    value: string;
  }[];
  title: string;
}

const AddPost = ({ setOption }: { setOption: (option: number) => void }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { categories: data, setNotifys } = React.useContext(
    GlobalContext
  ) as GlobalContextInterface;

  const categories = data !== null ? data : [];

  const normalCategories = categories.filter(
    (item: any) => !item.nsfw && !item.asPage
  );

  const nsfwCategories = categories.filter(
    (item: any) =>
      (item.nsfw &&
        item.asPage &&
        !item.hide &&
        !normalCategories.find((iteem) => iteem.slug === item.slug)) ||
      (item.asPage &&
        !item.hide &&
        !normalCategories.find((iteem) => iteem.slug === item.slug))
  );

  const {
    control,
    register,
    unregister,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddPostInterface>({
    defaultValues: {
      title: "",
      tags: [],
      memContainers: [],
    },
  });
  const {
    fields: fieldsTag,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: "tags",
    rules: {
      required: "Dodaj przynajmniej jeden tag!",
      minLength: 1,
      maxLength: 10,
    },
  });
  const {
    fields: fieldsMemContainers,
    append: appendMemContainer,
    remove: removeMemContainer,
  } = useFieldArray({
    control,
    name: "memContainers",
    rules: {
      required: "Przynajmniej jeden element jest wymagany!",
      minLength: 1,
      maxLength: 10,
      validate: (val) => {
        return val.filter((item) => item.data === null).length === 0;
      },
    },
  });

  const tags = watch("tags");
  const categoriesWatch = watch("category");
  const memContainers = watch("memContainers");
  const linking = watch("linking");

  useEffect(() => {
    if (linking) {
      register("linkingUrl", { required: "To pole jest wymagane" });
    } else unregister("linkingUrl");
    // eslint-disable-next-line
  }, [linking]);

  const linkingUrl = watch("linkingUrl");

  const setLinkingUrl = (url: string) => {
    setValue("linkingUrl", url);
  };

  const onSubmit = async (data: AddPostInterface) => {
    setLoading(true);
    const fd = new FormData();
    fd.append("title", data.title);
    fd.append("category", data.category || "");
    fd.append("linking", `${data.linking}`);
    if (data.linking && data.linkingUrl) {
      fd.append("linkingUrl", data.linkingUrl);
    }
    fd.append("tags", JSON.stringify(data.tags.map((item) => item.value)));
    const memContainersWithoutFiles = data.memContainers.map((item) => ({
      type: item.type,
      data: ["image", "video"].includes(item.type) ? "" : item.data,
    }));
    fd.append("memContainers", JSON.stringify(memContainersWithoutFiles));
    data.memContainers.forEach((item, i) => {
      fd.append(`file_${i}`, item.data as Blob);
    });

    const req = await fetch("/api/posts", {
      method: "POST",
      body: fd,
    });
    const res = await req.json();

    if (req.status === 200) {
      setOption(0);
      router.push("/oczekujace");
    } else {
      setLoading(false);
    }
    createNotifycation(setNotifys, "info", res.message);
  };

  const [currentTag, setCurrentTag] = useState<string>("");

  const handleTagname = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.indexOf(",")) setCurrentTag(e.target.value);
  };

  const handleAddTagKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Tab") {
      e.preventDefault();
      if (!/^[a-zA-Z0-9]*$/.test(currentTag)) return;
      if (
        tags.length >= 10 ||
        tags.filter((item) => item.value === currentTag).length > 0
      )
        return;
      if (currentTag === "") return null;
      appendTag({ value: currentTag });
      setCurrentTag("");
    }
  };

  const handleDeleteTag = (
    e: React.MouseEvent<HTMLButtonElement>,
    i: number
  ) => {
    e.preventDefault();
    if (tags.filter((item) => item.value === currentTag).length > 0) return;
    removeTag(i);
  };

  const handleClearCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    reset({ category: null });
  };

  interface TypeDataInterface {
    data: string | File | null;
    setData: (data: string | File | null, index: number) => void;
    index: number;
  }

  interface Type {
    [name: string]: React.FunctionComponent<TypeDataInterface>;
  }

  const types: Type = {
    image: ImageContainer,
    text: TextContainer,
    video: VideoContainer,
    youtube: YoutubeContainer,
  };

  const handleAddMemItem = (
    e: React.MouseEvent<HTMLButtonElement>,
    type: "image" | "text" | "video" | "youtube"
  ) => {
    e.preventDefault();
    appendMemContainer({
      data: null,
      type,
    });
  };

  return (
    <div className={style.addPostContainer}>
      {data !== null && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h3>Wpisz tytuł</h3>
            <input
              {...register("title", {
                required: "To pole jest wymagane!",
                minLength: 2,
                maxLength: 70,
              })}
              placeholder="Wpisz tytuł"
              type="text"
            />
            {errors?.title && (
              <p className={style.error}>{String(errors.title?.message)}</p>
            )}
          </div>
          <MemContainersSortable
            {...{
              memContainers,
              fieldsMemContainers,
              types,
              setValue,
              removeMemContainer,
            }}
          />
          <div>
            <h3>Co chcesz dodać?</h3>
            <div className={style.contentType}>
              <button onClick={(e) => handleAddMemItem(e, "image")}>
                <FaRegImage />
                <span>Obrazek/Gif</span>
              </button>
              <button onClick={(e) => handleAddMemItem(e, "text")}>
                <IoDocumentText />
                <span>Tekst</span>
              </button>
              <button onClick={(e) => handleAddMemItem(e, "video")}>
                <FaVideo />
                <span>Video MP4</span>
              </button>
              <button onClick={(e) => handleAddMemItem(e, "youtube")}>
                <FaYoutube />
                <span>Youtube</span>
              </button>
            </div>
            {errors?.memContainers && (
              <p className={style.error}>
                {String(errors.memContainers?.root?.message)}
              </p>
            )}
          </div>
          <div>
            <h3>Dodaj tagi</h3>
            <input
              type="text"
              placeholder="Wpisz tagi ..."
              value={currentTag}
              onChange={handleTagname}
              onKeyDown={handleAddTagKeys}
            />
            <div className={style.tags}>
              {fieldsTag.map((item, i) => (
                <span className={style.tagItem} key={item.id}>
                  <span className={style.title}>{tags[i].value}</span>
                  <button onClick={(e) => handleDeleteTag(e, i)}>
                    <IoClose />
                  </button>
                </span>
              ))}
            </div>
            {errors?.tags && (
              <p className={style.error}>
                {String(errors.tags?.root?.message)}
              </p>
            )}
            <span className={style.info}>
              Aby dodać kolejny tag należy dodać przecinek albo nacisnąć TAB.
            </span>
          </div>
          <div className={style.categories}>
            <h3>
              Gdzie chcesz dodać treść?{" "}
              <span className={style.optional}>{"(opcjonalnie)"}</span>
              <div>
                {normalCategories.map((item, i) => (
                  <label
                    key={i}
                    className={
                      categoriesWatch === item.slug ? style.active : ""
                    }
                  >
                    <input
                      {...register("category")}
                      name="category"
                      type="radio"
                      value={item.slug}
                    />
                    {item.name}
                  </label>
                ))}
                {normalCategories.filter(
                  (item: any) => item.slug === categoriesWatch!
                ).length > 0 && (
                  <button
                    onClick={handleClearCategory}
                    className={style.emptyButton}
                  >
                    wyczyść
                  </button>
                )}
              </div>
              <div>
                <span style={{ fontSize: "12px", color: "#de2127" }}>
                  nsfw:
                </span>
                <div>
                  {nsfwCategories.map((item, i) => (
                    <label
                      key={i}
                      className={
                        categoriesWatch === item.slug ? style.active : ""
                      }
                    >
                      <input
                        {...register("category")}
                        name="category"
                        type="radio"
                        value={item.slug}
                      />
                      {item.name}
                    </label>
                  ))}
                  {nsfwCategories.filter(
                    (item) => item.slug === categoriesWatch
                  ).length > 0 && (
                    <button
                      onClick={handleClearCategory}
                      className={style.emptyButton}
                    >
                      wyczyść
                    </button>
                  )}
                </div>
              </div>
              <div className={style.linking}>
                <label>
                  <input
                    type="checkbox"
                    {...register("linking")}
                    defaultChecked={false}
                  />
                  {!linking ? "Pokaż linkowanie" : "Schowaj linkowanie"}
                </label>
                {linking &&
                  (linkingUrl === undefined ? (
                    <>
                      <input
                        placeholder="Wpisz link"
                        type="url"
                        onChange={(e) => {
                          if (isValidHttpUrl(e.target.value))
                            setValue("linkingUrl", e.target.value);
                        }}
                      />
                      {errors?.linkingUrl && (
                        <p className={style.error}>
                          {String(errors?.linkingUrl?.message)}
                        </p>
                      )}
                    </>
                  ) : (
                    <CheckUrl data={linkingUrl} setData={setLinkingUrl} />
                  ))}
              </div>
            </h3>
          </div>
          <div className={style.addCancelButtons}>
            <button className={style.submit} type="submit">
              Dodaj
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setOption(0);
              }}
            >
              Anuluj
            </button>
          </div>
        </form>
      )}
      {loading && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "0",
            left: "0",
          }}
        >
          <Loading />
        </div>
      )}
    </div>
  );
};

export default AddPost;

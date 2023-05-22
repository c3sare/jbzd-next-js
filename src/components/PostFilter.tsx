import style from "@/styles/addpost.module.css";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { TbCheckbox } from "react-icons/tb";

interface SearchInterface {
  pharse: string;
  video: boolean;
  gif: boolean;
  image: boolean;
  text: boolean;
}

const PostFilter = ({ setOption }: any) => {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<SearchInterface>({
    defaultValues: {
      pharse: (router.query?.pharse as string) || "",
      video: Boolean(router.query?.video),
      gif: Boolean(router.query?.gif),
      image: Boolean(router.query?.image),
      text: Boolean(router.query?.text),
    },
  });

  const [video, gifs, pictures, texts] = [
    watch("video"),
    watch("gif"),
    watch("image"),
    watch("text"),
  ];

  const handleFilterPosts = (data: SearchInterface) => {
    const { pharse, video, gif, image, text } = data;

    const tab = [
      pharse.length > 0 ? "pharse=" + encodeURIComponent(pharse) : null,
      video ? "video=" + (video ? 1 : 0) : null,
      gif ? "gif=" + (gif ? 1 : 0) : null,
      image ? "image=" + (image ? 1 : 0) : null,
      text ? "text=" + (image ? 1 : 0) : null,
    ].filter((item) => item !== null);
    setOption(0);
    router.push(`${tab.length > 0 ? "?" : ""}${tab.join("&")}`);
  };

  return (
    <form
      className={style.postFilter}
      onSubmit={handleSubmit(handleFilterPosts)}
    >
      <div className={style.contentFiltersFilter}>
        <input
          type="text"
          placeholder="Szukana fraza..."
          {...register("pharse")}
        />
      </div>
      <div className={style.filterCheckboxes}>
        <label>
          <span>{video ? <TbCheckbox /> : <MdCheckBoxOutlineBlank />}</span>
          <span>Video</span>
          <input
            type="checkbox"
            style={{ display: "none" }}
            {...register("video")}
          />
        </label>
        <label>
          <span>{gifs ? <TbCheckbox /> : <MdCheckBoxOutlineBlank />}</span>
          <span>Gify</span>
          <input
            type="checkbox"
            style={{ display: "none" }}
            {...register("gif")}
          />
        </label>
        <label>
          <span>{pictures ? <TbCheckbox /> : <MdCheckBoxOutlineBlank />}</span>
          <span>Obrazki</span>
          <input
            type="checkbox"
            style={{ display: "none" }}
            {...register("image")}
          />
        </label>
        <label>
          <span>{texts ? <TbCheckbox /> : <MdCheckBoxOutlineBlank />}</span>
          <span>Tekst</span>
          <input
            type="checkbox"
            style={{ display: "none" }}
            {...register("text")}
          />
        </label>
      </div>
      <div className={style.contentFiltersButton}>
        <button type="submit">Filtruj</button>
      </div>
    </form>
  );
};

export default PostFilter;

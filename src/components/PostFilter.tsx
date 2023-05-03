import style from "@/styles/addpost.module.css";
import { useForm } from "react-hook-form";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { TbCheckbox } from "react-icons/tb";

interface SearchInterface {
  pharse: string;
  video: boolean;
  gifs: boolean;
  pictures: boolean;
  texts: boolean;
}

const PostFilter = () => {
  const { register, handleSubmit, watch } = useForm<SearchInterface>({
    defaultValues: {
      pharse: "",
      video: false,
      gifs: false,
      pictures: false,
      texts: false,
    },
  });

  const [video, gifs, pictures, texts] = [
    watch("video"),
    watch("gifs"),
    watch("pictures"),
    watch("texts"),
  ];

  return (
    <form className={style.postFilter} onSubmit={handleSubmit(console.log)}>
      <div className={style.contentFiltersFilter}>
        <input type="text" disabled placeholder="Opcja dostępna dla Premium" />
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
            {...register("gifs")}
          />
        </label>
        <label>
          <span>{pictures ? <TbCheckbox /> : <MdCheckBoxOutlineBlank />}</span>
          <span>Obrazki</span>
          <input
            type="checkbox"
            style={{ display: "none" }}
            {...register("pictures")}
          />
        </label>
        <label>
          <span>{texts ? <TbCheckbox /> : <MdCheckBoxOutlineBlank />}</span>
          <span>Tekst</span>
          <input
            type="checkbox"
            style={{ display: "none" }}
            {...register("texts")}
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

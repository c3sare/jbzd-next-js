import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import style from "@/styles/usersettings.module.css";
import createNotifycation from "@/utils/createNotifycation";
import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { TbCheckbox } from "react-icons/tb";
import Loading from "../Loading";

interface NotificationFormInterface {
  commentsOnMain: boolean;
  newComments: boolean;
  newOrders: boolean;
  pins: boolean;
}

const Notifycations = ({ data, isLoading, error, refreshForm }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setNotifys } = useContext(GlobalContext) as GlobalContextInterface;
  const { register, handleSubmit, watch, setValue } =
    useForm<NotificationFormInterface>();

  const commentsOnMain = watch("commentsOnMain");
  const newComments = watch("newComments");
  const newOrders = watch("newOrders");
  const pins = watch("pins");

  useEffect(() => {
    if (!isLoading && !error && data) {
      setValue("commentsOnMain", data.commentsOnMain);
      setValue("newComments", data.newComments);
      setValue("newOrders", data.newOrders);
      setValue("pins", data.pins);
    }
  }, [data]);

  const handleUpdateNotify = async (data: NotificationFormInterface) => {
    setLoading(true);
    const req = await fetch("/api/user/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await req.json();
    refreshForm();
    createNotifycation(setNotifys, "info", res.message);
    setLoading(false);
  };

  return (
    <section>
      <form
        onSubmit={handleSubmit(handleUpdateNotify)}
        className={style.userFormData}
      >
        <h3>Ustawienia notyfikacji</h3>
        <div className={style.userFormDataBlock}>
          <label>
            <span>
              {newOrders ? <TbCheckbox /> : <MdCheckBoxOutlineBlank />}
            </span>
            <span>Powiadomienia o nowych odznakach</span>
            <input
              type="checkbox"
              style={{ display: "none" }}
              disabled={loading}
              {...register("newOrders")}
            />
          </label>
        </div>
        <div className={style.userFormDataBlock}>
          <label>
            <span>{pins ? <TbCheckbox /> : <MdCheckBoxOutlineBlank />}</span>
            <span>Powiadomienia o oznaczeniach</span>
            <input
              type="checkbox"
              style={{ display: "none" }}
              disabled={loading}
              {...register("pins")}
            />
          </label>
        </div>
        <div className={style.userFormDataBlock}>
          <label>
            <span>
              {commentsOnMain ? <TbCheckbox /> : <MdCheckBoxOutlineBlank />}
            </span>
            <span>Powiadomienia o komentarzach na głównej</span>
            <input
              type="checkbox"
              style={{ display: "none" }}
              disabled={loading}
              {...register("commentsOnMain")}
            />
          </label>
        </div>
        <div className={style.userFormDataBlock}>
          <label>
            <span>
              {newComments ? <TbCheckbox /> : <MdCheckBoxOutlineBlank />}
            </span>
            <span>Powiadomienia o nowych komentarzach</span>
            <input
              type="checkbox"
              style={{ display: "none" }}
              disabled={loading}
              {...register("newComments")}
            />
          </label>
        </div>{" "}
        <div className={style.userFormDataBlock}>
          <button disabled={loading} type="submit">
            Zapisz
          </button>
        </div>
        {loading ||
          isLoading ||
          (error && (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: "0",
                left: "0",
              }}
            >
              {error ? <span>{error}</span> : <Loading />}
            </div>
          ))}
      </form>
    </section>
  );
};

export default Notifycations;

import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import style from "@/styles/usersettings.module.css";
import createNotifycation from "@/utils/createNotifycation";
import { useState, useContext } from "react";
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

const Notifycations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setNotifys } = useContext(GlobalContext) as GlobalContextInterface;
  const { register, handleSubmit, watch } = useForm<NotificationFormInterface>({
    defaultValues: async () => {
      setLoading(true);
      const req = await fetch("/api/user/notifications");
      const res = await req.json();
      setLoading(false);
      if (req.status === 200) {
        return res;
      } else {
        createNotifycation(setNotifys, "info", res.message);
      }
    },
  });

  const commentsOnMain = watch("commentsOnMain");
  const newComments = watch("newComments");
  const newOrders = watch("newOrders");
  const pins = watch("pins");

  const handleUpdateNotify = async (data: NotificationFormInterface) => {
    const req = await fetch("/api/user/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await req.json();

    createNotifycation(setNotifys, "info", res.message);
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
        {loading && (
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
            <Loading />
          </div>
        )}
      </form>
    </section>
  );
};

export default Notifycations;

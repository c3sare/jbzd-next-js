import style from "@/styles/usersettings.module.css";
import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { TbCheckbox } from "react-icons/tb";
import Loading from "../Loading";
import { BsCircle, BsCheckCircleFill } from "react-icons/bs";
import createNotifycation from "@/utils/createNotifycation";
import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import Link from "next/link";

interface PremiumOptionsInterface {
  memPerPage: number;
  adminPostsOff: boolean;
  imagesGifsCommentsOff: boolean;
  hideMinusedComments: boolean;
  adsOff: boolean;
  hideProfile: boolean;
  hidePremiumIconBeforeNickName: boolean;
  hideLowReputationComments: boolean;
}

const Premium = ({ data, isLoading, error, refreshForm }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setNotifys } = useContext(GlobalContext) as GlobalContextInterface;
  const { register, handleSubmit, watch } = useForm<PremiumOptionsInterface>({
    defaultValues: data?.premium || {
      memPerPage: 8,
      adsOff: true,
    },
  });

  const memPerPage = watch("memPerPage");
  const adminPostsOff = watch("adminPostsOff");
  const imagesGifsCommentsOff = watch("imagesGifsCommentsOff");
  const hideMinusedComments = watch("hideMinusedComments");
  const adsOff = watch("adsOff");
  const hideProfile = watch("hideProfile");
  const hidePremiumIconBeforeNickName = watch("hidePremiumIconBeforeNickName");
  const hideLowReputationComments = watch("hideLowReputationComments");

  const memPerPageRegister = register("memPerPage", { valueAsNumber: true });

  const handleUpdatePremiumSettings = async (data: PremiumOptionsInterface) => {
    setLoading(true);
    data.memPerPage = Number(data.memPerPage);
    const req = await fetch("/api/user/premium", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await req.json();

    if (req.status === 200) {
      createNotifycation(setNotifys, "info", res.message);
    } else {
      createNotifycation(setNotifys, "info", res.message);
    }
    refreshForm();
    setLoading(false);
  };

  return (
    <section style={{ position: "relative" }}>
      <h1 className={style.premium}>
        Opcje <span>Premium</span>
      </h1>
      {!data?.isPremium && !loading && !isLoading && !error && (
        <Link href="/premium/kup" className={style.userFormDataBuyButton}>
          Kup premium
        </Link>
      )}
      <form
        onSubmit={handleSubmit(handleUpdatePremiumSettings)}
        className={
          style.userFormData + (!data?.isPremium ? " " + style.noPremium : "")
        }
      >
        <div className={style.userFormDataBlock + " " + style.column}>
          <label>Wybór liczby obrazków na stronę:</label>
          <div className={style.radioGroup}>
            <label>
              <span>
                {Number(memPerPage) === 8 ? (
                  <BsCheckCircleFill />
                ) : (
                  <BsCircle />
                )}
              </span>
              <span>8</span>
              <input
                type="radio"
                style={{ display: "none" }}
                disabled={loading}
                value={8}
                {...memPerPageRegister}
              />
            </label>
            <label>
              <span>
                {Number(memPerPage) === 16 ? (
                  <BsCheckCircleFill />
                ) : (
                  <BsCircle />
                )}
              </span>
              <span>16</span>
              <input
                type="radio"
                style={{ display: "none" }}
                disabled={loading}
                value={16}
                {...memPerPageRegister}
              />
            </label>
            <label>
              <span>
                {Number(memPerPage) === 32 ? (
                  <BsCheckCircleFill />
                ) : (
                  <BsCircle />
                )}
              </span>
              <span>32</span>
              <input
                type="radio"
                style={{ display: "none" }}
                disabled={loading}
                value={32}
                {...memPerPageRegister}
              />
            </label>
          </div>
        </div>
        <div className={style.userFormDataBlock}>
          <label>
            <span>
              {adminPostsOff ? <TbCheckbox /> : <MdCheckBoxOutlineBlank />}
            </span>
            <span>Wyłączenie postów administracji</span>
            <input
              type="checkbox"
              style={{ display: "none" }}
              disabled={loading}
              {...register("adminPostsOff")}
            />
          </label>
        </div>
        <div className={style.userFormDataBlock}>
          <label>
            <span>
              {imagesGifsCommentsOff ? (
                <TbCheckbox />
              ) : (
                <MdCheckBoxOutlineBlank />
              )}
            </span>
            <span>Wyłączenie obrazków/gifów z komentarzy</span>
            <input
              type="checkbox"
              style={{ display: "none" }}
              disabled={loading}
              {...register("imagesGifsCommentsOff")}
            />
          </label>
        </div>
        <div className={style.userFormDataBlock}>
          <label>
            <span>
              {hideMinusedComments ? (
                <TbCheckbox />
              ) : (
                <MdCheckBoxOutlineBlank />
              )}
            </span>
            <span>Ukrywanie zminusowanych komentarzy</span>
            <input
              type="checkbox"
              style={{ display: "none" }}
              disabled={loading}
              {...register("hideMinusedComments")}
            />
          </label>
        </div>
        <div className={style.userFormDataBlock}>
          <label>
            <span>{adsOff ? <TbCheckbox /> : <MdCheckBoxOutlineBlank />}</span>
            <span>Wyłącz reklamy</span>
            <input
              type="checkbox"
              style={{ display: "none" }}
              disabled={loading}
              {...register("adsOff")}
            />
          </label>
        </div>
        <div className={style.userFormDataBlock}>
          <label>
            <span>
              {hideProfile ? <TbCheckbox /> : <MdCheckBoxOutlineBlank />}
            </span>
            <span>Ukrycie profilu (nie można do niego wejść)</span>
            <input
              type="checkbox"
              style={{ display: "none" }}
              disabled={loading}
              {...register("hideProfile")}
            />
          </label>
        </div>
        <div className={style.userFormDataBlock}>
          <label>
            <span>
              {hidePremiumIconBeforeNickName ? (
                <TbCheckbox />
              ) : (
                <MdCheckBoxOutlineBlank />
              )}
            </span>
            <span>
              Ukrycie ikonki premium przy nicku (działa z opóźnieniem kilku
              minutowym!)
            </span>
            <input
              type="checkbox"
              style={{ display: "none" }}
              disabled={loading}
              {...register("hidePremiumIconBeforeNickName")}
            />
          </label>
        </div>
        <div className={style.userFormDataBlock}>
          <label>
            <span>
              {hideLowReputationComments ? (
                <TbCheckbox />
              ) : (
                <MdCheckBoxOutlineBlank />
              )}
            </span>
            <span>Ukrywanie komentarzy użytkowników o niskiej reputacji</span>
            <input
              type="checkbox"
              style={{ display: "none" }}
              disabled={loading}
              {...register("hideLowReputationComments")}
            />
          </label>
        </div>
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

export default Premium;

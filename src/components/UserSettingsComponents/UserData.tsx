import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import style from "@/styles/usersettings.module.css";
import createNotifycation from "@/utils/createNotifycation";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Loading";
import React from "react";
import NoSsrWrapper from "../no-ssr-wrapper";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useSWR from "swr";
import FullContainerLoading from "../FullContainerLoading";
const Konva = dynamic(import("../Konva"), { ssr: false });

const isSSR = () => typeof window === "undefined";

interface FormDataInterface {
  name: string;
  gender: 0 | 1 | 2 | 3;
  country: string;
  city: string;
  birthday: string;
}

const UserDataForm = ({ addNotify, data, refreshUserData }: any) => {
  const [loading, setLoading] = useState<boolean>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataInterface>({
    defaultValues: data,
  });

  const saveData = async (data: FormDataInterface) => {
    setLoading(true);
    const req = await fetch("/api/user/userdata", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await req.json();

    if (req.status === 200) {
      addNotify(res.message);
    } else {
      addNotify(res.message);
    }
    refreshUserData();
    setLoading(false);
  };

  const registerName = register("name", {
    pattern: {
      value:
        /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+$/u,
      message: "Nieprawidłowo wprowadzone imię!",
    },
  });
  const registerGender = register("gender", {
    max: {
      value: 3,
      message: "Nieprawidłowa wartość pola!",
    },
    min: {
      value: 0,
      message: "Nieprawidłowa wartość pola!",
    },
  });
  const registerCountry = register("country", {
    pattern: {
      value:
        /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
      message: "Nieprawidłowo wprowadzone nazwę kraju!",
    },
  });
  const registerCity = register("city", {
    pattern: {
      value:
        /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
      message: "Nieprawidłowo wprowadzone nazwę miasta!",
    },
  });
  const registerBirthday = register("birthday", {
    pattern: {
      value: /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/,
      message: "Nieprawidłowo wprowadzona data!",
    },
  });

  return (
    <form className={style.userDataForm} onSubmit={handleSubmit(saveData)}>
      <div className={style.formGroup}>
        <input
          type="text"
          placeholder="Imię"
          {...registerName}
          disabled={loading}
          {...(errors.name ? { className: style.error } : {})}
        />
        {errors.name && (
          <span className={style.errorMsg}>{errors.name?.message}</span>
        )}
      </div>
      <div className={style.formGroup}>
        <select
          {...registerGender}
          disabled={loading}
          {...(errors.gender ? { className: style.error } : {})}
        >
          <option value={0}>Mężczyzna</option>
          <option value={1}>Kobieta</option>
          <option value={2}>Inna</option>
          <option value={3}>Śmigłowiec szturmowy Apache</option>
        </select>
        {errors.gender && (
          <span className={style.errorMsg}>{errors.gender?.message}</span>
        )}
      </div>
      <div className={style.formGroup}>
        <input
          type="text"
          placeholder="Kraj"
          {...registerCountry}
          disabled={loading}
          {...(errors.country ? { className: style.error } : {})}
        />
        {errors.country && (
          <span className={style.errorMsg}>{errors.country?.message}</span>
        )}
      </div>
      <div className={style.formGroup}>
        <input
          type="text"
          placeholder="Miasto"
          {...registerCity}
          disabled={loading}
          {...(errors.city ? { className: style.error } : {})}
        />
        {errors.city && (
          <span className={style.errorMsg}>{errors.city?.message}</span>
        )}
      </div>
      <div className={style.formGroup}>
        <input
          type="date"
          {...registerBirthday}
          disabled={loading}
          {...(errors.birthday ? { className: style.error } : {})}
        />
        {errors.birthday && (
          <span className={style.errorMsg}>{errors.birthday?.message}</span>
        )}
      </div>
      <div className={style.formButtons}>
        <button type="submit" disabled={loading}>
          Zapisz
        </button>
      </div>
      {loading && <FullContainerLoading />}
    </form>
  );
};

const Avatar = ({ addNotify, data, refreshAvatar }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [zoom, setZoom] = useState(1);
  const [file, setFile] = useState<string>(data.avatar);
  const canvasRef = useRef<any>(null);
  const avatarCanvas = useMemo(
    () =>
      file !== "" && (
        <NoSsrWrapper>
          {!isSSR() && (
            <Konva
              canvasRef={canvasRef}
              src={file}
              zoom={zoom}
              setFile={setFile}
            />
          )}
        </NoSsrWrapper>
      ),
    [zoom, file]
  );

  useEffect(() => {
    setZoom(1);
  }, [file]);

  const handleSendAvatar = () => {
    if (file === "") return;
    setLoading(true);
    fetch("/api/user/avatar", {
      method: "POST",
      body: JSON.stringify({ avatar: canvasRef.current!.toDataURL() }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        addNotify(data.message);
        refreshAvatar();
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className={style.avatar}>
      <div>{avatarCanvas}</div>
      <p>
        <small>
          <i>
            Avatar nie może zawierać treści +18, ustawienie ich będzie
            skutkowało banem perm.
          </i>
        </small>
      </p>
      <p>
        <small>Kliknij obrazek aby go zmienić.</small>
      </p>
      <input
        type="range"
        min="1"
        max="3"
        step="0.02"
        value={String(zoom)}
        onChange={(e) => setZoom(Number(e.target.value))}
      />
      <div className={style.formButtons}>
        <button onClick={handleSendAvatar}>Zapisz</button>
      </div>
      {loading && <Loading />}
    </div>
  );
};

const ChangePassword = ({ addNotify }: { addNotify: any }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useForm();

  const sendData = async (data: any) => {
    setLoading(true);
    const req = await fetch("/api/user/changepwd", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await req.json();

    if (req.status === 200) {
      addNotify(res.message);
      setValue("currentPassword", "");
      setValue("newPassword", "");
      setValue("reNewPassword", "");
    } else {
      addNotify(res.message);
    }
    setLoading(false);
  };

  const passwordPattern = {
    pattern: {
      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      message: "Hasło musi zawierać 8 znaków, 1 literę i 1 cyfrę!",
    },
  };

  const registerCurrentPassword = register("currentPassword", {
    ...passwordPattern,
    required: "Wprowadź aktualne hasło!",
  });
  const registerNewPassword = register("newPassword", {
    ...passwordPattern,
    required: "Wprowadź nowe hasło!",
  });
  const registerReNewPassword = register("reNewPassword", {
    ...passwordPattern,
    required: "Powtórz nowe hasło!",
    validate: (value: string) => {
      if (value === getValues("newPassword")) return true;
      else return "Hasła nie są identyczne!";
    },
  });

  return (
    <form onSubmit={handleSubmit(sendData)} className={style.userDataForm}>
      <div className={style.formGroup}>
        <input
          type="password"
          placeholder="Aktualne hasło"
          {...registerCurrentPassword}
          {...(errors.currentPassword ? { className: style.error } : {})}
        />
        {errors.currentPassword && (
          <span className={style.errorMsg}>
            {errors.currentPassword?.message as string}
          </span>
        )}
      </div>
      <div className={style.formGroup}>
        <input
          type="password"
          placeholder="Nowe hasło"
          {...registerNewPassword}
          {...(errors.newPassword ? { className: style.error } : {})}
        />
        {errors.newPassword && (
          <span className={style.errorMsg}>
            {errors.newPassword?.message as string}
          </span>
        )}
      </div>
      <div className={style.formGroup}>
        <input
          type="password"
          placeholder="Powtórz nowe hasło"
          {...registerReNewPassword}
          {...(errors.reNewPassword ? { className: style.error } : {})}
        />
        {errors.reNewPassword && (
          <span className={style.errorMsg}>
            {errors.reNewPassword?.message as string}
          </span>
        )}
      </div>
      <div className={style.formButtons}>
        <button type="submit">Zmień hasło</button>
      </div>
      {loading && <FullContainerLoading />}
    </form>
  );
};

const UserData = () => {
  const router = useRouter();
  const {
    data: userData,
    isLoading: isLoadingUserData,
    error: errorUserData,
    mutate: refreshUserData,
  } = useSWR("/api/user/userdata", {
    refreshInterval: 0,
    keepPreviousData: true,
    revalidateOnMount: true,
  });
  const {
    data: dataAvatar,
    isLoading: isLoadingAvatar,
    error: errorAvatar,
    mutate: refreshAvatar,
  } = useSWR("/api/user/avatar", {
    refreshInterval: 0,
    keepPreviousData: true,
    revalidateOnMount: true,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { setNotifys, createMonit, refreshLogin } = useContext(
    GlobalContext
  ) as GlobalContextInterface;

  const addNotify = (msg: string) => {
    createNotifycation(setNotifys, "info", msg);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    const req = await fetch("/api/user/deleteacc", {
      method: "POST",
    });
    const res = await req.json();

    if (req.status === 200) {
      addNotify("Twoje konto zostało pomyślnie usunięte!");
      router.push("/");
      refreshLogin();
    } else {
      addNotify(res.message);
    }
    setLoading(false);
  };

  return (
    <section style={{ position: "relative" }}>
      <h3>Dane konta</h3>
      {!isLoadingUserData && !errorUserData && userData ? (
        <UserDataForm
          addNotify={addNotify}
          data={userData}
          refreshUserData={refreshUserData}
        />
      ) : (
        <Loading />
      )}
      <h3>Avatar</h3>
      {!isLoadingAvatar && !errorAvatar && dataAvatar ? (
        <Avatar
          addNotify={addNotify}
          data={dataAvatar}
          refreshAvatar={refreshAvatar}
        />
      ) : (
        <Loading />
      )}
      <h3>Hasło</h3>
      <ChangePassword addNotify={addNotify} />
      <h3>Usuwanie konta:</h3>
      <div className={style.formDeleteAccount}>
        <p>
          Jeżeli chcesz usunąć swoje konto kliknij{" "}
          <button
            onClick={() =>
              createMonit(
                "Potwierdzenie",
                "Czy jesteś pewien że chcesz usunąć konto?",
                handleDeleteAccount
              )
            }
          >
            tutaj
          </button>
        </p>
        {loading && <FullContainerLoading />}
      </div>
    </section>
  );
};

export default UserData;

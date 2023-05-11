import { GlobalContext, GlobalContextInterface } from "@/context/ContextNew";
import style from "@/styles/usersettings.module.css";
import createNotifycation from "@/utils/createNotifycation";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Loading";
import React from "react";
import Link from "next/link";

interface FormDataInterface {
  name: string;
  gender: 0 | 1 | 2 | 3;
  country: string;
  city: string;
  birthday: string;
}

const UserDataForm = ({
  setLoading,
  addNotify,
}: {
  setLoading: any;
  addNotify: any;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataInterface>({
    defaultValues: async () => {
      setIsLoading(true);
      const data = await fetch("/api/user/userdata");
      const formData = (await data.json()) as FormDataInterface;
      setIsLoading(false);
      return formData;
    },
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
          disabled={isLoading}
          {...(errors.name ? { className: style.error } : {})}
        />
        {errors.name && (
          <span className={style.errorMsg}>{errors.name?.message}</span>
        )}
      </div>
      <div className={style.formGroup}>
        <select
          {...registerGender}
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
          {...(errors.birthday ? { className: style.error } : {})}
        />
        {errors.birthday && (
          <span className={style.errorMsg}>{errors.birthday?.message}</span>
        )}
      </div>
      <div className={style.formButtons}>
        <button type="submit" disabled={isLoading}>
          Zapisz
        </button>
      </div>
    </form>
  );
};

const Canvas = ({
  url,
  zoom,
  height,
  width,
  setBlob,
  onClick,
}: {
  url: string;
  zoom: number;
  height: number;
  width: number;
  setBlob: any;
  onClick: any;
}) => {
  const [pos, setPos] = useState([0, 0]);
  const move = useRef<boolean>(false);
  const canvas = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const ctx = canvas!.current!.getContext("2d");
    const img = new Image();
    img.onload = function () {
      const h = img.naturalHeight;
      const w = img.naturalWidth;
      const width = (w > h ? 204 * (w / h) : 204) * zoom;
      const height = (h > w ? 204 * (h / w) : 204) * zoom;
      ctx!.clearRect(0, 0, 204, 204);
      setPos([
        width > 204 ? ((width - 204) / 2) * -1 : 0,
        height > 204 ? ((height - 204) / 2) * -1 : 0,
      ]);
      ctx?.drawImage(img, pos[0], pos[1], width, height);
      canvas!.current!.toBlob((blob) => {
        setBlob(blob);
      });
    };
    img.src = url;
  }, [zoom, url]);

  return (
    <canvas
      ref={canvas}
      height={height}
      width={width}
      onClick={onClick}
      onMouseDown={() => {
        move.current = true;
      }}
      onMouseUp={() => {
        move.current = false;
      }}
    />
  );
};

const Avatar = ({
  setLoading,
  addNotify,
}: {
  setLoading: any;
  addNotify: any;
}) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [blob, setBlob] = useState<any>(null);

  const canvas = useMemo(
    () => (
      <Canvas
        zoom={zoom}
        url={file ? URL.createObjectURL(file) : "/images/avatars/default.jpg"}
        height={204}
        width={204}
        setBlob={setBlob}
        onClick={() => fileInput.current!.click()}
      />
    ),
    [zoom, file]
  );

  console.log(zoom);
  return (
    <div className={style.avatar}>
      <div>
        {canvas}
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          onChange={(e) =>
            e.target?.files?.[0] ? setFile(e.target.files[0]) : null
          }
        />
      </div>
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
        <button>Zapisz</button>
      </div>
    </div>
  );
};

const ChangePassword = ({
  setLoading,
  addNotify,
}: {
  setLoading: any;
  addNotify: any;
}) => {
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
    </form>
  );
};

const UserData = () => {
  const [loading, setLoading] = useState<boolean>();
  const { setNotifys } = useContext(GlobalContext) as GlobalContextInterface;

  const addNotify = (msg: string) => {
    createNotifycation(setNotifys, "info", msg);
  };

  return (
    <section style={{ position: "relative" }}>
      <h3>Dane konta</h3>
      <UserDataForm setLoading={setLoading} addNotify={addNotify} />
      {loading && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, .5)",
            position: "absolute",
            top: "0",
            left: "0",
          }}
        >
          <Loading />
        </div>
      )}
      <h3>Avatar</h3>
      <Avatar setLoading={setLoading} addNotify={addNotify} />
      <h3>Hasło</h3>
      <ChangePassword setLoading={setLoading} addNotify={addNotify} />
      <h3>Usuwanie konta:</h3>
      <div className={style.formDeleteAccount}>
        <p>
          Jeżeli chcesz usunąć swoje konto kliknij{" "}
          <Link href="/uzytkownik/usuwanie">tutaj</Link>
        </p>
      </div>
    </section>
  );
};

export default UserData;

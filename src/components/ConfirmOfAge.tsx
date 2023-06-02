import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import style from "@/styles/confirmage.module.css";

interface FormInterface {
  day: number;
  month: number;
  year: number;
}

const ConfirmOfAge = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<FormInterface>();

  const sendForm = (data: FormInterface) => {
    setLoading(true);
    const year = Number(data.year);
    const day = Number(data.day);
    const month = Number(data.month);
    const dayFormated = day > 9 ? day : "0" + day;
    const monthFormated = month > 9 ? month : "0" + month;

    const fullDate = `${year}-${monthFormated}-${dayFormated}`;
    fetch("/api/user/confirmage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: fullDate,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.ofage) router.reload();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const dayOptions = {
    required: true,
    min: 1,
    max: 31,
  };

  const monthOptions = {
    required: true,
    min: 1,
    max: 12,
  };

  const yearOptions = {
    required: true,
    min: 1900,
    max: new Date().getFullYear(),
  };

  const dayRegister = register("day", dayOptions);
  const monthRegister = register("month", monthOptions);
  const yearRegister = register("year", yearOptions);

  return (
    <form onSubmit={handleSubmit(sendForm)} className={style.confirmAgeForm}>
      <h1>Potwierdź swój wiek</h1>
      <div className={style.inputs}>
        <label>
          <span>Dzień</span>
          <input
            maxLength={2}
            max={31}
            min={1}
            disabled={loading}
            placeholder="DD"
            type="number"
            name={dayRegister.name}
            ref={dayRegister.ref}
            onChange={(e) => {
              if (e.target.value.length > 2) {
                e.target.value = e.target.value.slice(0, 2);
              }
              dayRegister.onChange(e);
            }}
            onBlur={dayRegister.onBlur}
          />
        </label>
        <label>
          <span>Miesiąc</span>
          <input
            maxLength={2}
            max={12}
            min={1}
            disabled={loading}
            placeholder="MM"
            type="number"
            name={monthRegister.name}
            ref={monthRegister.ref}
            onChange={(e) => {
              if (e.target.value.length > 2) {
                e.target.value = e.target.value.slice(0, 2);
              }
              monthRegister.onChange(e);
            }}
            onBlur={monthRegister.onBlur}
          />
        </label>
        <label>
          <span>Rok</span>
          <input
            maxLength={4}
            min={1900}
            max={new Date().getFullYear()}
            minLength={4}
            disabled={loading}
            placeholder="YYYY"
            type="number"
            name={yearRegister.name}
            ref={yearRegister.ref}
            onChange={(e) => {
              if (e.target.value.length > 4) {
                e.target.value = e.target.value.slice(0, 4);
              }
              yearRegister.onChange(e);
            }}
            onBlur={yearRegister.onBlur}
          />
        </label>
      </div>
      <button type="submit" disabled={loading}>
        Potwierdź swój wiek
      </button>
    </form>
  );
};

export default ConfirmOfAge;

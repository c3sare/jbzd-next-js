import style from "@/styles/addpost.module.css";
import { useRouter } from "next/router";
import { DayPicker } from "react-day-picker";
import { compareAsc, format } from "date-fns";
import pl from "date-fns/locale/pl";
import { useState } from "react";

const TopFilter = () => {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const presets = ["Nowe", "6h", "12h", "24h", "48h", "7d"];

  const currentSet = (
    router.query["date-preset"] ? router.query["date-preset"] : ""
  ) as string;

  const setDatePreset = (
    e: React.MouseEvent<HTMLButtonElement>,
    preset: string
  ) => {
    e.preventDefault();
    if (preset === "") return router.push("");
    router.push(`/?date-preset=${preset}`);
  };

  const setCustomDates = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (startDate && endDate)
      router.push(
        `?from=${format(startDate, "yyyy-MM-dd")}&to=${format(
          endDate,
          "yyyy-MM-dd"
        )}`
      );
  };

  console.log(currentSet);

  return (
    <form className={style.topFilter}>
      <div className={style.presets}>
        {presets.map((preset, i) => (
          <button
            key={i}
            className={
              currentSet === (preset !== "Nowe" ? preset : "")
                ? style.active
                : ""
            }
            onClick={(e) => setDatePreset(e, preset !== "Nowe" ? preset : "")}
          >
            {preset}
          </button>
        ))}
      </div>
      <div className={style.datePickerContainer}>
        <b>Dowolny zakres dat:</b>
        <div>
          <span>Od:</span>
          <DayPicker
            onSelect={(val) => {
              if (!endDate) return setStartDate(val);
              if (val && endDate)
                if ([0, 1].includes(compareAsc(endDate, val)))
                  setStartDate(val);
            }}
            selected={startDate}
            locale={pl}
            mode="single"
            toDate={endDate || new Date()}
          />
        </div>
        <div>
          <span>Do:</span>
          <DayPicker
            locale={pl}
            mode="single"
            selected={endDate}
            onSelect={setEndDate}
            toDate={new Date()}
            fromDate={startDate}
          />
        </div>
      </div>
      <div className={style.submitButtons}>
        <button
          style={{ width: "70%" }}
          className={startDate && endDate ? style.submit : ""}
          onClick={setCustomDates}
        >
          Filtruj
        </button>
        <button onClick={(e) => setDatePreset(e, "")}>Reset</button>
      </div>
    </form>
  );
};

export default TopFilter;

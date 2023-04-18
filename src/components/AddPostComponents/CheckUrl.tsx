/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import style from "@/styles/addpost.module.css";

const CheckUrl = (props: any) => {
  const { data } = props;
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    fetch("/api/sitepreview/" + encodeURIComponent(data))
      .then((data) => data.json())
      .then((data) => setState(data));
    // eslint-disable-next-line
  }, []);

  return state === null ? (
    <span>Ładowanie...</span>
  ) : (
    <div className={style.preview}>
      <div>
        <img src={state.img} alt="Obraz Linku" />
      </div>
      <div>
        <h3>{state.title}</h3>
        <p>{state.description}</p>
        <span>{state.domain}</span>
      </div>
    </div>
  );
};

export default CheckUrl;

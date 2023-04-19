import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import style from "@/styles/addpost.module.css";

function youtube_parser(url: string) {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
}

const YoutubeContainer = ({
  data,
  setData,
  index,
}: {
  data: string | File | null;
  setData: (data: string | File | null, index: number) => void;
  index: number;
}): JSX.Element => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const vidId = youtube_parser(url);
    if (vidId !== false)
      fetch(`/api/youtubevideo/${vidId}`)
        .then((data) => data.json())
        .then((data) => {
          if (data.videoExist) setData(vidId, index);
        })
        .catch((err) => console.log(err));
    // eslint-disable-next-line
  }, [url]);

  return (
    <div className={style.youtube}>
      {data === null ? (
        <>
          <h3>Link do filmu Youtube</h3>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Wklej link filmu Youtube"
          />
        </>
      ) : (
        <>
          <YouTube
            opts={{ width: "100%", height: "310px" }}
            videoId={data as string}
          />
          <button
            className={style.changeVideoBtn}
            onClick={() => {
              setUrl("");
              setData(null, index);
            }}
          >
            Zmień
          </button>
        </>
      )}
    </div>
  );
};

export default YoutubeContainer;

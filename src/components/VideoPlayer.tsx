import Plyr from "plyr-react";
import { useEffect, useMemo, useRef } from "react";

const VideoPlayer = ({ url, gif = false }: { url: string; gif?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const plyr = useMemo(
    () => (
      <Plyr
        source={{
          type: "video",
          sources: [
            {
              src: url,
              type: "video/mp4",
            },
          ],
        }}
        options={{
          controls: gif
            ? []
            : [
                "play-large",
                "play",
                "progress",
                "current-time",
                "mute",
                "volume",
                "settings",
                "pip",
                "fullscreen",
              ],
          autoplay: gif,
          loop: { active: gif },
        }}
        playsInline={false}
        loop={gif}
        autoPlay={gif}
      />
    ),
    [url, gif]
  );

  useEffect(() => {
    if (ref.current !== null) {
      const a = `<a class="plyr__controls__item plyr__control" href="${url}" target="_blank" download="" data-plyr="download" aria-pressed="false"><svg aria-hidden="true" focusable="false"><use xlink:href="#plyr-download"></use></svg><span class="plyr__sr-only">Download</span></a>`;
      const plyrControls =
        ref.current.querySelector(".plyr__controls")?.innerHTML;
      ref.current.querySelector(".plyr__controls")!.innerHTML =
        plyrControls + a;
    }
  }, [url]);

  return (
    <div ref={ref} style={{ maxWidth: "100%", width: "600px" }}>
      {plyr}
    </div>
  );
};

export default VideoPlayer;

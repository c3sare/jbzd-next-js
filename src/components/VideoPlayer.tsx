import Plyr from "plyr-react";
import { useMemo } from "react";

const VideoPlayer = ({ url }: { url: string }) => {
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
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "settings",
            "pip",
            "fullscreen",
            "download",
          ],
        }}
      />
    ),
    []
  );

  return <div style={{ maxWidth: "100%", width: "600px" }}>{plyr}</div>;
};

export default VideoPlayer;

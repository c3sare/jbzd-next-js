import Plyr from "plyr-react";

const VideoPlayer = ({ url }: { url: string }) => {
  return (
    <div style={{ maxWidth: "600px" }}>
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
    </div>
  );
};

export default VideoPlayer;

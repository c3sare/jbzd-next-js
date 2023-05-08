import Plyr from "plyr-react";

const VideoPlayer = ({ url }: { url: string }) => {
  const videoOptions = {
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
    download: url,
    urls: [url],
  };

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
        options={videoOptions}
      />
    </div>
  );
};

export default VideoPlayer;

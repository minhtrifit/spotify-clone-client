import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const Audio = () => {
  return (
    <AudioPlayer
      autoPlay
      showSkipControls
      src={
        "http://docs.google.com/uc?export=open&id=1K_XLMhRmX7roaVqvRl7poO0tq5fwJGbr"
      }
      style={{
        backgroundColor: "black",
      }}
      onPlay={(e) => console.log(e)}
      onClickNext={(e) => console.log(e)}
      onClickPrevious={(e) => console.log(e)}
    />
  );
};

export default Audio;

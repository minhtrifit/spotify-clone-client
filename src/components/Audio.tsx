import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { Audio as AudioType } from "../types/media";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const Audio = () => {
  const audio = useSelector<RootState, AudioType | null>(
    (state) => state.media.targetAudio
  );

  return (
    <AudioPlayer
      autoPlay
      showSkipControls
      src={audio?.url}
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

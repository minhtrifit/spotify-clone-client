import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { Audio as AudioType } from "../types/media";
import { Album as AlbumType } from "../types/media";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const Audio = () => {
  const dispatch = useDispatch();

  const audio = useSelector<RootState, AudioType | null>(
    (state) => state.media.targetAudio
  );

  const album = useSelector<RootState, AlbumType | null>(
    (state) => state.media.targetAlbum
  );

  const isPlayingAlbum = useSelector<RootState, boolean>(
    (state) => state.media.isPlayingAlbum
  );

  const handleEndAudio = () => {
    if (isPlayingAlbum && audio && album?.audios) {
      const checkIsPlayingAudioIndex = album.audios.findIndex(
        (item) => item.id === audio.id
      );

      let nextAudioIndex = 0;
      const albumSize = album.audios.length;

      if (checkIsPlayingAudioIndex === albumSize - 1) nextAudioIndex = 0;
      else nextAudioIndex = checkIsPlayingAudioIndex + 1;

      // Update next audio
      const nextAudio = album.audios[nextAudioIndex];
      dispatch({ type: "media/updateTargetAudio", payload: nextAudio });
    } else {
      //
    }
  };

  return (
    <AudioPlayer
      autoPlay
      showSkipControls
      src={audio?.url}
      style={{
        backgroundColor: "black",
      }}
      onPlay={() => {
        dispatch({ type: "media/updateIsPlaying", payload: true });
      }}
      onPause={() => {
        dispatch({ type: "media/updateIsPlaying", payload: false });
      }}
      onEnded={() => {
        handleEndAudio();
      }}
      // onClickNext={(e) => console.log(e)}
      // onClickPrevious={(e) => console.log(e)}
    />
  );
};

export default Audio;

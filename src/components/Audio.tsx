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

  const handleNextAudio = () => {
    if (isPlayingAlbum && album?.audios && audio) {
      const playingAudioIndex = album?.audios?.findIndex(
        (x) => x.id === audio.id
      );

      const lastAudio = album?.audios?.slice(-1)[0];
      const lastAudioIndex = album?.audios?.findIndex(
        (x) => x.id === lastAudio?.id
      );

      if (playingAudioIndex === lastAudioIndex && album.audios) {
        dispatch({ type: "media/updateTargetAudio", payload: album.audios[0] });
      } else {
        const nextAudio = album.audios[playingAudioIndex + 1];

        dispatch({ type: "media/updateTargetAudio", payload: nextAudio });
      }
    }
  };

  const handlePreviousAudio = () => {
    if (isPlayingAlbum && album?.audios && audio) {
      const playingAudioIndex = album?.audios?.findIndex(
        (x) => x.id === audio.id
      );

      const lastAudio = album?.audios?.slice(-1)[0];
      const lastAudioIndex = album?.audios?.findIndex(
        (x) => x.id === lastAudio?.id
      );

      if (playingAudioIndex === 0 && album.audios) {
        dispatch({
          type: "media/updateTargetAudio",
          payload: album.audios[lastAudioIndex],
        });
      } else {
        const previousAudio = album.audios[playingAudioIndex - 1];

        dispatch({ type: "media/updateTargetAudio", payload: previousAudio });
      }
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
      onClickNext={() => handleNextAudio()}
      onClickPrevious={() => handlePreviousAudio()}
    />
  );
};

export default Audio;

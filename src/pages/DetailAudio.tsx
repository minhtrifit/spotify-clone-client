import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { RootState } from "../redux/store";
import { getAudioById } from "../redux/reducers/media.reducer";

import { Audio } from "../types/media";

import { IoMdPlay, IoMdPause } from "react-icons/io";
import { LuHeart } from "react-icons/lu";
import { HiDotsHorizontal } from "react-icons/hi";

import { useParams } from "react-router-dom";

const DetailAudio = () => {
  const params = useParams();
  const { id } = params;

  const dispatchAsync = useAppDispatch();
  const dispatch = useDispatch();

  const audio = useSelector<RootState, Audio | null>(
    (state) => state.media.detailAudio
  );

  const isPlayingAudio = useSelector<RootState, boolean>(
    (state) => state.media.isPlayingAudio
  );

  useEffect(() => {
    if (id) dispatchAsync(getAudioById(Number(id)));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayAudio = (audio: Audio) => {
    dispatch({ type: "media/updateTargetAudio", payload: audio });

    if (isPlayingAudio)
      dispatch({ type: "media/updateIsPlaying", payload: false });
    else dispatch({ type: "media/updateIsPlaying", payload: true });

    // Trigger playing album list
    dispatch({ type: "media/updateIsPlayingAlbum", payload: false });
  };

  return (
    <div className="bg-gray-800 pt-[80px]">
      {audio && (
        <div className="px-6 flex flex-wrap gap-5">
          <div className="w-[200px] h-[200px]">
            <img src={audio.avatar} alt="avatar" />
          </div>
          <div className="flex flex-col gap-5 self-end">
            <p className="text-sm font-semibold">Song</p>
            <p className="text-7xl font-black">{audio?.name}</p>
            <div className="flex flex-wrap text-sm text-gray-500 font-thin">
              {audio.artists &&
                audio.artists?.map((artist, index, row) => {
                  if (index + 1 === row.length) {
                    // last one
                    return <p key={artist.id}>{artist.name}</p>;
                  } else {
                    // Not last one
                    return <p key={artist.id}>{artist.name}, </p>;
                  }
                })}
            </div>
          </div>
        </div>
      )}

      <div
        className="px-6 mt-10
                    bg-gradient-to-t from-[#121212] to-transparent"
      >
        {audio && (
          <div className="flex items-center gap-10">
            <div
              className="rounded-full w-[60px] h-[60px] flex justify-center items-center bg-[#1ed760]
            transform transition duration-200 hover:scale-110 hover:cursor-pointer"
              onClick={() => {
                handlePlayAudio(audio);
              }}
            >
              {isPlayingAudio ? (
                <IoMdPause color={"black"} size={30} />
              ) : (
                <IoMdPlay color={"black"} size={30} />
              )}
            </div>

            <div className="text-gray-500 hover:text-white hover:cursor-pointer">
              <LuHeart size={35} />
            </div>

            <div className="text-gray-500 hover:text-white hover:cursor-pointer">
              <HiDotsHorizontal size={30} />
            </div>
          </div>
        )}

        {audio && (
          <div className="mt-16 flex flex-wrap items-center">
            {audio.artists &&
              audio.artists.map((artist) => {
                return (
                  <div
                    key={artist.id}
                    className="py-2 pl-2 pr-10 rounded-md flex items-center gap-5 hover:cursor-pointer hover:bg-[#292929]"
                  >
                    <div className="w-[100px] h-[100px] rounded-full">
                      <img
                        className="w-[100%] rounded-full"
                        src={artist.avatar}
                        alt="avatar"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">Artist</p>
                      <p className="font-bold">{artist.name}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailAudio;

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { RootState } from "../redux/store";
import { getAlbumById } from "../redux/reducers/media.reducer";

import { Album, Audio } from "../types/media";

import { IoMdPlay, IoMdPause } from "react-icons/io";
import { LuHeart } from "react-icons/lu";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoStatsChartSharp } from "react-icons/io5";

import { useParams } from "react-router-dom";

import { fetchAudioDuration } from "../helpers";

const DetailAlbum = () => {
  const params = useParams();
  const { id } = params;

  const navigate = useNavigate();

  const dispatchAsync = useAppDispatch();
  const dispatch = useDispatch();

  const [durations, setDurations] = useState<any[]>([]);

  const album = useSelector<RootState, Album | null>(
    (state) => state.media.detailAlbum
  );

  const isPlayingAudio = useSelector<RootState, boolean>(
    (state) => state.media.isPlayingAudio
  );

  const targetAudio = useSelector<RootState, Audio | null>(
    (state) => state.media.targetAudio
  );

  useEffect(() => {
    if (id) dispatchAsync(getAlbumById(Number(id)));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchDurations = async () => {
      try {
        if (album && album.audios !== undefined) {
          const durationPromises = album.audios.map((audio) => {
            if (audio.url) {
              return fetchAudioDuration(audio.url); // Return the promise
            }
            return null; // Return null for falsy audio.url values
          });

          const formattedDurations = await Promise.all(
            durationPromises.filter(Boolean)
          ); // Filter out null values

          setDurations(formattedDurations);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDurations();
  }, [album]);

  const handlePlayAlbum = (album: Album) => {
    if (album.audios) {
      dispatch({ type: "media/updateTargetAudio", payload: album.audios[0] });
    }

    // Set target album
    dispatch({ type: "media/updateTargetAlbum", payload: album });

    // Trigger playing album list
    dispatch({ type: "media/updateIsPlayingAlbum", payload: true });
  };

  const handlePlayAudio = (audio: Audio) => {
    dispatch({ type: "media/updateTargetAudio", payload: audio });

    if (isPlayingAudio)
      dispatch({ type: "media/updateIsPlaying", payload: false });
    else dispatch({ type: "media/updateIsPlaying", payload: true });

    // Set target album
    dispatch({ type: "media/updateTargetAlbum", payload: album });

    // Trigger playing album list
    dispatch({ type: "media/updateIsPlayingAlbum", payload: true });
  };

  return (
    <div className="bg-gray-800 pt-[80px]">
      {album && (
        <div className="px-6 flex flex-wrap gap-5">
          <div className="w-[200px] h-[200px]">
            <img src={album.avatar} alt="avatar" />
          </div>
          <div className="flex flex-col gap-5 self-end">
            <p className="text-sm font-semibold">Album</p>
            <p className="text-7xl font-black">{album?.name}</p>
            <div className="flex flex-wrap text-sm text-gray-500 font-thin">
              <p>Release: {album.createdAt?.split(" ")[0]}</p>
            </div>
          </div>
        </div>
      )}

      <div
        className="px-6 mt-10
                bg-gradient-to-t from-[#121212] to-transparent"
      >
        {album && (
          <div className="flex items-center gap-10">
            <div
              className="rounded-full w-[60px] h-[60px] flex justify-center items-center bg-[#1ed760]
                        transform transition duration-200 hover:scale-110 hover:cursor-pointer"
              onClick={() => {
                handlePlayAlbum(album);
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

        {album?.audios && (
          <div className="mt-16 flex flex-col">
            {album.audios.map((audio, index) => {
              if (audio.url) {
                const duration = durations[index];

                return (
                  <div
                    key={audio.id}
                    className="flex items-center justify-between gap-10 px-4 rounded-md hover:cursor-pointer hover:bg-[#292929]"
                    onDoubleClick={() => {
                      handlePlayAudio(audio);
                    }}
                  >
                    <div className="flex items-center gap-10">
                      <div className="min-w-[40px] max-w-[40px] flex justify-center">
                        {targetAudio?.id === audio.id ? (
                          <p className="text-main-green">
                            <IoStatsChartSharp size={20} />
                          </p>
                        ) : (
                          <p>{index + 1}</p>
                        )}
                      </div>

                      <div className="flex gap-5 py-4">
                        <div className="w-[50px] h-[50px]">
                          <img src={audio.avatar} alt="avatar" />
                        </div>
                        <div>
                          <p
                            className={`hover:underline hover:underline-offset-2 ${
                              targetAudio?.id === audio.id && "text-main-green"
                            }`}
                            onClick={() => {
                              navigate(`/audio/${audio.id}`);
                            }}
                          >
                            {audio.name}
                          </p>
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
                    </div>

                    <p>{duration}</p>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailAlbum;

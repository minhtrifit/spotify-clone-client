import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { useNavigate } from "react-router-dom";

import { IoMdPlay, IoMdPause } from "react-icons/io";

import { Album, Audio } from "../types/media";

interface PropType {
  title: string;
  type: "audio" | "album" | "playlist";
  list: Audio[] | Album[];
  max: number | null;
}

const MediaCard = (props: PropType) => {
  const { title, type, list, max } = props;

  const [overPlayBtn, setOverPlayBtn] = useState<boolean>(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const isPlayingAudio = useSelector<RootState, boolean>(
    (state) => state.media.isPlayingAudio
  );

  const handlePlayAudio = (audio: Audio) => {
    dispatch({ type: "media/updateTargetAudio", payload: audio });

    if (isPlayingAudio)
      dispatch({ type: "media/updateIsPlaying", payload: false });
    else dispatch({ type: "media/updateIsPlaying", payload: true });

    // Trigger playing album list
    dispatch({ type: "media/updateIsPlayingAlbum", payload: false });
  };

  const handlePlayAlbum = (album: Album) => {
    if (album.audios) {
      dispatch({ type: "media/updateTargetAudio", payload: album.audios[0] });

      if (isPlayingAudio)
        dispatch({ type: "media/updateIsPlaying", payload: false });
      else dispatch({ type: "media/updateIsPlaying", payload: true });

      // Set target album
      dispatch({ type: "media/updateTargetAlbum", payload: album });

      // Trigger playing album list
      dispatch({ type: "media/updateIsPlayingAlbum", payload: true });
    }
  };

  return (
    <div className="w-[100%] mt-10 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold">{title}</p>
        {max !== null && (
          <p
            className="text-sm text-gray-400 font-semibold hover:cursor-pointer hover:underline hover:underline-offset-4"
            onClick={() => {
              if (type === "audio") navigate("/all/audio");
              if (type === "album") navigate("/all/album");
            }}
          >
            Show all
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-10">
        {/* List all */}
        {type === "audio" &&
          max === null &&
          list?.map((item: Audio) => {
            return (
              <div
                key={item.id}
                className="group relative min-w-[180px] max-w-[180px] bg-[#1a1a1a] p-4 rounded-md flex flex-col gap-5 hover:bg-[#2a2a2a] hover:cursor-pointer"
                onClick={() => {
                  if (!overPlayBtn) navigate(`/audio/${item.id}`);
                }}
              >
                <div className="w-[150px] h-[150px] flex">
                  <img src={item.avatar} alt="avatar" />
                </div>

                <div
                  className="hidden group-hover:flex absolute right-6 top-[110px] rounded-full w-[45px] h-[45px]
                flex justify-center items-center bg-[#1ed760] transform transition duration-200 hover:scale-110"
                  onClick={() => {
                    handlePlayAudio(item);
                  }}
                  onMouseOver={() => {
                    setOverPlayBtn(true);
                  }}
                  onMouseLeave={() => {
                    setOverPlayBtn(false);
                  }}
                >
                  {isPlayingAudio ? (
                    <IoMdPause color={"black"} size={25} />
                  ) : (
                    <IoMdPlay color={"black"} size={25} />
                  )}
                </div>

                <div className="flex flex-col flex-wrap gap-3">
                  <p className="font-bold">{item.name}</p>
                  <p className="font-thin text-gray-500 text-sm">
                    {item.artists && item.artists[0].name}
                  </p>
                </div>
              </div>
            );
          })}

        {type === "album" &&
          max === null &&
          list?.map((item: any) => {
            return (
              <div
                key={item.id}
                className="group relative min-w-[180px] max-w-[180px] bg-[#1a1a1a] p-4 rounded-md flex flex-col gap-5 hover:bg-[#2a2a2a] hover:cursor-pointer"
                onClick={() => {
                  if (!overPlayBtn) navigate(`/album/${item.id}`);
                }}
              >
                <div className="w-[150px] h-[150px] flex">
                  <img src={item.avatar} alt="avatar" />
                </div>

                <div
                  className="hidden group-hover:flex absolute right-6 top-[110px] rounded-full w-[45px] h-[45px]
                flex justify-center items-center bg-[#1ed760] transform transition duration-200 hover:scale-110"
                  onClick={() => {
                    handlePlayAlbum(item);
                  }}
                  onMouseOver={() => {
                    setOverPlayBtn(true);
                  }}
                  onMouseLeave={() => {
                    setOverPlayBtn(false);
                  }}
                >
                  {isPlayingAudio ? (
                    <IoMdPause color={"black"} size={25} />
                  ) : (
                    <IoMdPlay color={"black"} size={25} />
                  )}
                </div>

                <div className="flex flex-col flex-wrap gap-3">
                  <p className="font-bold">{item.name}</p>
                  <p className="font-thin text-gray-500 text-sm">
                    Release: {item.createdAt && item.createdAt.split(" ")[0]}
                  </p>
                </div>
              </div>
            );
          })}

        {/* List by max */}
        {type === "audio" &&
          max !== null &&
          list?.map((item: Audio, index: number) => {
            if (index <= max)
              return (
                <div
                  key={item.id}
                  className="group relative min-w-[180px] max-w-[180px] bg-[#1a1a1a] p-4 rounded-md flex flex-col gap-5 hover:bg-[#2a2a2a] hover:cursor-pointer"
                  onClick={() => {
                    if (!overPlayBtn) navigate(`/audio/${item.id}`);
                  }}
                >
                  <div className="w-[150px] h-[150px] flex">
                    <img src={item.avatar} alt="avatar" />
                  </div>

                  <div
                    className="hidden group-hover:flex absolute right-6 top-[110px] rounded-full w-[45px] h-[45px]
                  flex justify-center items-center bg-[#1ed760] transform transition duration-200 hover:scale-110"
                    onClick={() => {
                      handlePlayAudio(item);
                    }}
                    onMouseOver={() => {
                      setOverPlayBtn(true);
                    }}
                    onMouseLeave={() => {
                      setOverPlayBtn(false);
                    }}
                  >
                    {isPlayingAudio ? (
                      <IoMdPause color={"black"} size={25} />
                    ) : (
                      <IoMdPlay color={"black"} size={25} />
                    )}
                  </div>

                  <div className="flex flex-col flex-wrap gap-3">
                    <p className="font-bold">{item.name}</p>
                    <p className="font-thin text-gray-500 text-sm">
                      {item.artists && item.artists[0].name}
                    </p>
                  </div>
                </div>
              );
          })}

        {type === "album" &&
          max !== null &&
          list?.map((item: any, index: number) => {
            if (index <= 4)
              return (
                <div
                  key={item.id}
                  className="group relative min-w-[180px] max-w-[180px] bg-[#1a1a1a] p-4 rounded-md flex flex-col gap-5 hover:bg-[#2a2a2a] hover:cursor-pointer"
                  onClick={() => {
                    if (!overPlayBtn) navigate(`/album/${item.id}`);
                  }}
                >
                  <div className="w-[150px] h-[150px] flex">
                    <img src={item.avatar} alt="avatar" />
                  </div>

                  <div
                    className="hidden group-hover:flex absolute right-6 top-[110px] rounded-full w-[45px] h-[45px]
                  flex justify-center items-center bg-[#1ed760] transform transition duration-200 hover:scale-110"
                    onClick={() => {
                      handlePlayAlbum(item);
                    }}
                    onMouseOver={() => {
                      setOverPlayBtn(true);
                    }}
                    onMouseLeave={() => {
                      setOverPlayBtn(false);
                    }}
                  >
                    {isPlayingAudio ? (
                      <IoMdPause color={"black"} size={25} />
                    ) : (
                      <IoMdPlay color={"black"} size={25} />
                    )}
                  </div>

                  <div className="flex flex-col flex-wrap gap-3">
                    <p className="font-bold">{item.name}</p>
                    <p className="font-thin text-gray-500 text-sm">
                      Release: {item.createdAt && item.createdAt.split(" ")[0]}
                    </p>
                  </div>
                </div>
              );
          })}
      </div>
    </div>
  );
};

export default MediaCard;

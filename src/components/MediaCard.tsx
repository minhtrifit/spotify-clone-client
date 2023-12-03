import { useState } from "react";

import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import { IoMdPlay } from "react-icons/io";

import { Audio } from "../types/media";

interface PropType {
  title: string;
  type: "audio" | "album" | "playlist";
  list: Audio[];
}

const MediaCard = (props: PropType) => {
  const { title, type, list } = props;

  const [overPlayBtn, setOverPlayBtn] = useState<boolean>(false);

  const nagivate = useNavigate();

  const dispatch = useDispatch();

  const handlePlayAudio = (audio: Audio) => {
    dispatch({ type: "media/updateTargetAudio", payload: audio });
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xl font-bold">{title}</p>
      <div className="flex flex-wrap gap-10">
        {type === "audio" &&
          list?.map((item: Audio, index: number) => {
            if (index <= 4)
              return (
                <div
                  key={item.id}
                  className="group relative bg-[#1a1a1a] p-4 rounded-md flex flex-col gap-5 hover:bg-[#2a2a2a] hover:cursor-pointer"
                  onClick={() => {
                    if (!overPlayBtn) nagivate(`/audio/${item.id}`);
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
                    <IoMdPlay color={"black"} size={25} />
                  </div>

                  <div className="flex flex-col gap-3">
                    <p className="font-bold">{item.name}</p>
                    <p className="font-thin text-gray-500 text-sm">
                      {item.artists && item.artists[0].name}
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

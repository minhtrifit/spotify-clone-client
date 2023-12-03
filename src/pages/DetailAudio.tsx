import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { RootState } from "../redux/store";
import { getAudioById } from "../redux/reducers/media.reducer";

import { Audio } from "../types/media";

import { IoMdPlay } from "react-icons/io";

import { useParams } from "react-router-dom";

const DetailAudio = () => {
  const params = useParams();
  const { id } = params;

  const dispatchAsync = useAppDispatch();

  const audio = useSelector<RootState, Audio | null>(
    (state) => state.media.detailAudio
  );

  useEffect(() => {
    if (id) dispatchAsync(getAudioById(Number(id)));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatch = useDispatch();

  const handlePlayAudio = (audio: Audio) => {
    dispatch({ type: "media/updateTargetAudio", payload: audio });
  };

  return (
    <div>
      {audio && (
        <div className="flex flex-wrap gap-5">
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
      <div className="mt-10">
        {audio && (
          <div
            className="rounded-full w-[60px] h-[60px] flex justify-center items-center bg-[#1ed760]
            transform transition duration-200 hover:scale-110 hover:cursor-pointer"
            onClick={() => {
              handlePlayAudio(audio);
            }}
          >
            <IoMdPlay color={"black"} size={30} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailAudio;

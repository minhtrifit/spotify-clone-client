import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useSelector, useDispatch } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { RootState } from "../redux/store";
import {
  getAllPlaylistsByUserId,
  getAudioById,
  modifyAddPlaylist,
} from "../redux/reducers/media.reducer";
import { handleAccessToken } from "../redux/reducers/user.reducer";

import { Audio, Playlist } from "../types/media";
import { User } from "../types/user";

import { IoMdPlay, IoMdPause } from "react-icons/io";
import { LuHeart } from "react-icons/lu";
import { HiDotsHorizontal } from "react-icons/hi";
import { CgAlbum } from "react-icons/cg";

import { useParams } from "react-router-dom";

const DetailAudio = () => {
  const params = useParams();
  const { id } = params;

  const dispatchAsync = useAppDispatch();
  const dispatch = useDispatch();

  const [openAddPlaylist, setOpenAddPlaylist] = useState<boolean>(false);

  const audio = useSelector<RootState, Audio | null>(
    (state) => state.media.detailAudio
  );

  const isPlayingAudio = useSelector<RootState, boolean>(
    (state) => state.media.isPlayingAudio
  );

  const userProfile = useSelector<RootState, User | null>(
    (state) => state.user.profile
  );

  const userPlaylist = useSelector<RootState, Playlist[]>(
    (state) => state.media.userPlaylist
  );

  useEffect(() => {
    dispatchAsync(handleAccessToken());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userProfile !== null && userProfile.id) {
      dispatchAsync(getAllPlaylistsByUserId(userProfile.id));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  useEffect(() => {
    if (id) dispatchAsync(getAudioById(Number(id)));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Define the click event handler type
  type ClickEventHandler = (event: MouseEvent) => void;

  useEffect(() => {
    // Add the click event listener to the document
    document.addEventListener("click", handleClick);

    // Remember to clean up the listener on unmount
    return () => document.removeEventListener("click", handleClick);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Declare the event listener function
  const handleClick: ClickEventHandler = (event) => {
    const target = event.target as HTMLElement;
    const id = target.id;

    if (target.className.includes) {
      // const name = target.className.includes("add-dropdown-menu");
      if (
        !target.className.includes("add-playlist-menu") ||
        !target.className.includes("add-playlist-menu-overlay")
      )
        setOpenAddPlaylist(false);
    }

    if (!target.className.includes && id !== "add") {
      setOpenAddPlaylist(false);
    }
  };

  const handlePlayAudio = (audio: Audio) => {
    dispatch({ type: "media/updateTargetAudio", payload: audio });

    if (isPlayingAudio)
      dispatch({ type: "media/updateIsPlaying", payload: false });
    else dispatch({ type: "media/updateIsPlaying", payload: true });

    // Trigger playing album list
    dispatch({ type: "media/updateIsPlayingAlbum", payload: false });
  };

  const handleModifyAddPlaylist = async (playlistId: number) => {
    try {
      if (audio?.id && userProfile?.id && playlistId) {
        const data = {
          userId: userProfile.id,
          playlistId: playlistId,
          audioId: audio.id,
        };

        console.log(data);

        const res = await dispatchAsync(modifyAddPlaylist(data));

        if (res.type === "playlists/modifyAddPlaylist/fulfilled") {
          toast.success("Modify playlist successfully");
        } else {
          toast.error("Modify playlist failed");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Modify playlist failed");
    }
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

            <div className="add-playlist-menu relative text-gray-500 hover:text-white hover:cursor-pointer">
              <div
                className="add-playlist-menu-overlay absolute top-0 rounded-full w-[100%] h-[100%] opacity-0 hover:cursor-pointer"
                onClick={() => {
                  if (!userProfile) {
                    toast.error("Please login to add this audio");
                    return;
                  }

                  setOpenAddPlaylist(!openAddPlaylist);
                }}
              ></div>

              <LuHeart className="add-playlist-menu" size={35} />

              {openAddPlaylist && (
                <div className="absolute bg-[#242424] flex flex-col gap-3 text-white p-2 top-0 left-[50px]">
                  <p className="self-center text-[15px] text-[#727272]">
                    Add audio to playlist
                  </p>

                  {userPlaylist.length !== 0 &&
                    userPlaylist?.map((playlist) => {
                      return (
                        <div
                          key={playlist.id}
                          className="min-w-[250px] max-w-[250px] flex items-center justify-between hover:bg-[#353535] p-2 rounded-md"
                          onClick={() => {
                            if (playlist.id)
                              handleModifyAddPlaylist(playlist.id);
                          }}
                        >
                          <p className="truncate">{playlist.name}</p>
                          <CgAlbum size={20} />
                        </div>
                      );
                    })}
                </div>
              )}
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

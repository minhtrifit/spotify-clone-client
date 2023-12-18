import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useAppDispatch } from "../redux/hooks";

import { getAllPlaylistsByUserId } from "../redux/reducers/media.reducer";

import { User } from "../types/user";
import { Playlist } from "../types/media";

import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { FaSpotify } from "react-icons/fa";
import { BiSearchAlt2, BiSolidSearch, BiLibrary } from "react-icons/bi";
import { SlLogin } from "react-icons/sl";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoMdAdd } from "react-icons/io";

interface Proptype {
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
}

const Slidebar = (props: Proptype) => {
  const { active, setActive } = props;

  const navigate = useNavigate();

  const dispatchAsync = useAppDispatch();

  const params = window.location.href;

  const nagivate = useNavigate();

  const userProfile = useSelector<RootState, User | null>(
    (state) => state.user.profile
  );

  const userPlaylist = useSelector<RootState, Playlist[]>(
    (state) => state.media.userPlaylist
  );

  useEffect(() => {
    if (params.includes("/search")) {
      setActive("search");
    } else {
      setActive("home");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    if (userProfile !== null && userProfile.id) {
      dispatchAsync(getAllPlaylistsByUserId(userProfile.id));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  return (
    <div className="hidden min-w-[250px] max-h-screen md:flex flex-col gap-2">
      <div className="bg-[#121212] rounded-md py-6 px-6">
        <Link to="/">
          <div className="flex items-center gap-[3px]">
            <p>
              <FaSpotify size={25} />
            </p>
            <p className="text-md">Spotify</p>
          </div>
        </Link>

        <div className="mt-[25px] text-[15px] flex flex-col gap-8">
          <div
            className={`flex justify-start items-center hover:cursor-pointer ${
              active === "home" && "font-semibold"
            }`}
            onClick={() => {
              setActive("home");
              nagivate("/");
            }}
          >
            <p className="w-[40px]">
              {active === "home" ? (
                <GoHomeFill size={30} />
              ) : (
                <GoHome size={30} />
              )}
            </p>
            <p className="ml-3">Home</p>
          </div>
          <div
            className={`flex justify-start items-center hover:cursor-pointer ${
              active === "search" && "font-semibold"
            }`}
            onClick={() => {
              setActive("search");
              nagivate("/search");
            }}
          >
            <p className="w-[40px]">
              {active === "search" ? (
                <BiSolidSearch size={30} />
              ) : (
                <BiSearchAlt2 size={30} />
              )}
            </p>
            <p className="ml-3">Search</p>
          </div>
        </div>
      </div>

      <div
        className={`flex flex-col h-[100%] text-[15px] bg-[#121212] rounded-md py-4 px-6 ${
          userPlaylist.length === 0 ? "gap-[100px]" : "gap-10"
        }`}
      >
        <div className="flex justify-between items-center">
          <div
            className="flex items-center gap-3 hover:cursor-pointer hover:font-semibold"
            onClick={() => {
              if (userProfile === null) {
                toast.error("Please login to add playlist");
                return;
              }

              navigate("/add/playlist");
            }}
          >
            <BiLibrary size={30} />
            <p>Your Library</p>
          </div>

          <div className="hover:cursor-pointer">
            <IoMdAdd size={25} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 h-[100%] overflow-y-auto">
          {userPlaylist.length === 0 ? (
            <div
              className="flex flex-col gap-5 items-center hover:cursor-pointer"
              onClick={() => {
                // if (userProfile === null) {
                //   toast.error("Please login to add playlist");
                //   return;
                // }

                if (userProfile !== null) {
                  navigate("/add/playlist");
                }
              }}
            >
              {!userProfile ? (
                <div
                  className="flex flex-col gap-5 items-center"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  <SlLogin size={25} />
                  <p>Login to create playlist</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-5">
                  <AiOutlineAppstoreAdd size={40} />
                  <p className="text-[12px] text-zinc-400">
                    Your playlist is empty, click to add
                  </p>
                </div>
              )}
            </div>
          ) : (
            userPlaylist.map((playlist) => {
              return (
                <div
                  key={playlist.id}
                  className="rounded-md w-[100%] flex items-center gap-5 p-2 hover:cursor-pointer hover:bg-[#242424]"
                  onClick={() => {
                    navigate(`/playlist/${playlist.id}`);
                  }}
                >
                  <div className="min-w-[50px] max-w-[50px] min-h-[60px] max-h-[60px] flex items-center justify-center">
                    <img
                      src={playlist.avatar}
                      alt="avatar"
                      className="w-[100%]"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="truncate text-sm font-black max-w-[100px]">
                      {playlist.name}
                    </p>
                    <p className="text-[12px] text-zinc-500">
                      Audios: {playlist.audios?.length}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Slidebar;

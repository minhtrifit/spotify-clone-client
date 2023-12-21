import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoAdd,
} from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { FaMicrophoneLines } from "react-icons/fa6";
import { RiFolderUserFill } from "react-icons/ri";
import { LuLogOut, LuAlbum } from "react-icons/lu";
import { MdOutlinePlaylistAdd, MdAudiotrack } from "react-icons/md";

import { User } from "../types/user";

import UserDropdown from "./UserDropdown";
import AddDropdown from "./AddDropdown";

import AddArtistModal from "./AddArtistModal";
import AddAudioModal from "./AddAudioModal";
import AddAlbumModal from "./AddAlbumModal";

const Header = () => {
  const navigate = useNavigate();

  const userProfile = useSelector<RootState, User | null>(
    (state) => state.user.profile
  );

  const [openAddArtistModal, setOpenAddArtistModal] = useState<boolean>(false);
  const [openAddAudioModal, setOpenAddAudioModal] = useState<boolean>(false);
  const [openAddAlbumModal, setOpenAddAlbumModal] = useState<boolean>(false);

  const userDropDownItems = [
    {
      label: "Profile",
      icon: <RiFolderUserFill />,
      roles: ["ROLE_USER", "ROLE_ADMIN"],
    },
    {
      label: "Log out",
      icon: <LuLogOut />,
      roles: ["ROLE_USER", "ROLE_ADMIN"],
    },
  ];

  const addDropDownItems = [
    {
      label: "Add new artist",
      icon: <FaMicrophoneLines />,
      type: "Artist",
      roles: ["ROLE_ADMIN"],
    },
    {
      label: "Management",
      icon: <CiEdit />,
      type: "Artist",
      roles: ["ROLE_ADMIN"],
    },
    {
      label: "Add new audio",
      icon: <MdAudiotrack />,
      type: "Audio",
      roles: ["ROLE_ADMIN"],
    },
    {
      label: "Management",
      icon: <CiEdit />,
      type: "Audio",
      roles: ["ROLE_ADMIN"],
    },
    {
      label: "Add new album",
      icon: <LuAlbum />,
      type: "Album",
      roles: ["ROLE_ADMIN"],
    },
    {
      label: "Management",
      icon: <CiEdit />,
      type: "Album",
      roles: ["ROLE_ADMIN"],
    },
    {
      label: "Add new playlist",
      icon: <MdOutlinePlaylistAdd />,
      type: "Playlist",
      roles: ["ROLE_USER", "ROLE_ADMIN"],
    },
    {
      label: "Management",
      icon: <CiEdit />,
      type: "Playlist",
      roles: ["ROLE_ADMIN"],
    },
  ];

  return (
    <div
      className={`w-[100%] h-[50px] px-6 top-3 flex items-center justify-between`}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-[35px] h-[35px] bg-black rounded-full flex justify-center items-center hover:cursor-pointer"
          onClick={() => {
            window.history.back();
          }}
        >
          <IoChevronBackOutline size={25} />
        </div>
        <div className="w-[35px] h-[35px] bg-black rounded-full flex justify-center items-center hover:cursor-pointer">
          <IoChevronForwardOutline
            size={25}
            onClick={() => {
              window.history.forward();
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-5">
        {userProfile ? (
          <>
            <AddDropdown
              icon={<IoAdd id="add" />}
              items={addDropDownItems}
              setOpenAddArtistModal={setOpenAddArtistModal}
              setOpenAddAudioModal={setOpenAddAudioModal}
              setOpenAddAlbumModal={setOpenAddAlbumModal}
            />

            <AddArtistModal
              openAddArtistModal={openAddArtistModal}
              setOpenAddArtistModal={setOpenAddArtistModal}
            />

            <AddAudioModal
              openAddAudioModal={openAddAudioModal}
              setOpenAddAudioModal={setOpenAddAudioModal}
            />

            <AddAlbumModal
              openAddAlbumModal={openAddAlbumModal}
              setOpenAddAlbumModal={setOpenAddAlbumModal}
            />

            <UserDropdown
              icon={<FaChevronDown id="user" />}
              items={userDropDownItems}
            />
          </>
        ) : (
          <>
            <div
              className="text-gray-400 font-semibold
                    hover:cursor-pointer hover:text-white transform transition duration-200 hover:scale-110"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign up
            </div>

            <div
              className="bg-white text-black font-semibold py-3 px-8 rounded-[100px]
                    hover:cursor-pointer transform transition duration-200 hover:scale-110"
              onClick={() => {
                navigate("/login");
              }}
            >
              Log in
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;

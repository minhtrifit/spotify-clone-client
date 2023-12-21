import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { User } from "../types/user";
import { useNavigate } from "react-router-dom";

interface ItemType {
  label: string;
  icon: React.ReactNode;
  type: string;
  roles: string[];
}

interface PropType {
  icon: React.ReactNode;
  items: ItemType[];
  setOpenAddArtistModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenAddAudioModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenAddAlbumModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddDropdown = (props: PropType) => {
  const {
    icon,
    items,
    setOpenAddArtistModal,
    setOpenAddAudioModal,
    setOpenAddAlbumModal,
  } = props;

  const navigate = useNavigate();

  const [show, setShow] = useState<boolean>(false);

  const userProfile = useSelector<RootState, User | null>(
    (state) => state.user.profile
  );

  const types = [
    { label: "Artist", roles: ["ROLE_ADMIN"] },
    { label: "Audio", roles: ["ROLE_ADMIN"] },
    { label: "Album", roles: ["ROLE_ADMIN"] },
    { label: "Playlist", roles: ["ROLE_USER", "ROLE_ADMIN"] },
  ];

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
        !target.className.includes("add-dropdown-menu") ||
        !target.className.includes("add-dropdown-menu-overlay")
      )
        setShow(false);
    }

    if (!target.className.includes && id !== "add") {
      setShow(false);
    }
  };

  const handleActiveItem = (name: string, type: string) => {
    if (name === "Add new artist" && type === "Artist") {
      setOpenAddArtistModal(true);
    }

    if (name === "Add new audio" && type === "Audio") {
      setOpenAddAudioModal(true);
    }

    if (name === "Add new album" && type === "Album") {
      setOpenAddAlbumModal(true);
    }

    if (name === "Add new playlist" && type === "Playlist") {
      navigate("/add/playlist");
    }

    if (name === "Management") {
      navigate(`/management/${type.toLowerCase()}`);
    }
  };

  return (
    <div className="group relative">
      <div
        className="add-dropdown-menu w-[40px] h-[40px] p-2 flex items-center justify-center rounded-full border border-solid
                    hover:cursor-pointer hover:scale-105 group-hover:border-[#1ed760] group-hover:text-[#1ed760]"
        onClick={() => {
          setShow(!show);
        }}
      >
        <p className="user-dropdown-menu">{icon}</p>
      </div>

      <div
        className="add-dropdown-menu-overlay absolute top-0 rounded-full w-[100%] h-[100%] opacity-0 hover:cursor-pointer"
        onClick={() => {
          setShow(!show);
        }}
      ></div>

      <div
        className={`absolute z-30 p-[5px] top-[50px] min-w-[200px] rounded-sm right-[0px] bg-[#242424] flex flex-col items-center ${
          show ? "flex" : "hidden"
        }`}
      >
        {types.map((t) => {
          if (userProfile?.roles && t.roles.includes(userProfile?.roles))
            return (
              <div key={uuidv4()} className="w-[100%] my-1">
                <p className="self-start px-4 text-[15px] text-[#727272]">
                  {t.label}
                </p>
                {items?.map((item) => {
                  if (
                    userProfile?.roles &&
                    item.roles.includes(userProfile?.roles) &&
                    item.type === t.label
                  ) {
                    return (
                      <div
                        key={uuidv4()}
                        className={`dropdown-items w-[100%] flex items-center justify-between px-4 py-2 hover:bg-[#353535] hover:cursor-pointer`}
                        onClick={() => {
                          handleActiveItem(item.label, item.type);
                        }}
                      >
                        <p>{item.label}</p>
                        <p>{item.icon}</p>
                      </div>
                    );
                  }
                })}
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default AddDropdown;

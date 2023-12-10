import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { User } from "../types/user";

interface ItemType {
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

interface PropType {
  icon: React.ReactNode;
  items: ItemType[];
}

const UserDropdown = (props: PropType) => {
  const { icon, items } = props;

  const [show, setShow] = useState<boolean>(false);

  const userProfile = useSelector<RootState, User | null>(
    (state) => state.user.profile
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      // const name = target.className.includes("user-dropdown-menu");
      if (
        !target.className.includes("user-dropdown-menu") ||
        !target.className.includes("user-dropdown-menu-overlay")
      )
        setShow(false);
    }

    if (!target.className.includes && id !== "user") {
      setShow(false);
    }
  };

  const handleActiveItem = (name: string) => {
    if (name === "Log out") {
      dispatch({ type: "user/logoutAccount" });
      toast.success("Log out successfully");
      navigate("/");
    }
  };

  return (
    <div className="group relative">
      <div
        className="user-dropdown-menu h-[40px] p-2 flex items-center justify-center gap-3 hover:cursor-pointer group-hover:text-[#1ed760]"
        onClick={() => {
          setShow(!show);
        }}
      >
        <div className="user-dropdown-menu">{userProfile?.username}</div>
        <p className="user-dropdown-menu">{icon}</p>
      </div>

      <div
        className="user-dropdown-menu-overlay absolute top-0 rounded-full w-[100%] h-[100%] opacity-0 hover:cursor-pointer"
        onClick={() => {
          setShow(!show);
        }}
      ></div>

      <div
        className={`absolute z-30 p-[5px] top-[50px] min-w-[200px] rounded-sm right-[0px] bg-[#242424] flex flex-col items-center ${
          show ? "flex" : "hidden"
        }`}
      >
        {items?.map((item) => {
          return (
            <div
              key={uuidv4()}
              className={`dropdown-items w-[100%] flex items-center justify-between px-4 py-2 hover:bg-[#353535] hover:cursor-pointer ${
                item.label === "Log out" && "text-red-500"
              }`}
              onClick={() => {
                handleActiveItem(item.label);
              }}
            >
              <p>{item.label}</p>
              <p>{item.icon}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserDropdown;

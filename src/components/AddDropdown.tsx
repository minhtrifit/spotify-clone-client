import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface PropType {
  icon: React.ReactNode;
  items: string[];
  setOpenAddArtistModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddDropdown = (props: PropType) => {
  const { icon, items, setOpenAddArtistModal } = props;

  const [show, setShow] = useState<boolean>(false);

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
      const name = target.className.includes("add-dropdown-menu");
      if (!name) setShow(false);
    }

    if (!target.className.includes && id !== "add") {
      setShow(false);
    }
  };

  const handleActiveItem = (name: string) => {
    if (name === "Add new artist") {
      setOpenAddArtistModal(true);
    }
  };

  return (
    <div className="relative">
      <div
        className="add-dropdown-menu w-[40px] h-[40px] p-2 flex items-center justify-center rounded-full border border-solid
                    hover:cursor-pointer hover:scale-105"
        onClick={() => {
          setShow(!show);
        }}
      >
        {icon}
      </div>

      <div
        className={`absolute z-30 p-[5px] top-[50px] min-w-[200px] rounded-sm right-[0px] bg-[#242424] flex flex-col items-center ${
          show ? "flex" : "hidden"
        }`}
      >
        {items?.map((item) => {
          return (
            <div
              key={uuidv4()}
              className={`dropdown-items w-[100%] px-4 py-2 hover:bg-[#353535] hover:cursor-pointer ${
                item === "Log out" && "text-red-500"
              }`}
              onClick={() => {
                handleActiveItem(item);
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddDropdown;

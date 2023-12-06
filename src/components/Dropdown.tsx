import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface PropType {
  icon: React.ReactNode;
  items: string[];
}

const Dropdown = (props: PropType) => {
  const { icon, items } = props;

  const [show, setShow] = useState<boolean>(false);

  return (
    <div className="relative z-999999">
      <div
        className="p-2 flex items-center justify-center rounded-full border border-solid
                    hover:cursor-pointer hover:scale-105"
        onClick={() => {
          setShow(!show);
        }}
      >
        {icon}
      </div>
      <div
        className={`absolute p-[5px] top-[50px] min-w-[200px] rounded-sm right-[0px] bg-[#242424] flex flex-col items-center ${
          show ? "flex" : "hidden"
        }`}
      >
        {items?.map((item) => {
          return (
            <div
              key={uuidv4()}
              className="w-[100%] px-4 py-2 hover:bg-[#353535] hover:cursor-pointer"
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dropdown;

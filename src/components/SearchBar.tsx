import { useState } from "react";
import { IoIosSearch, IoMdClose } from "react-icons/io";

import { useAppDispatch } from "../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { getAllAudios } from "../redux/reducers/media.reducer";

import { Audio as AudioType } from "../types/media";

const SearchBar = () => {
  const [search, setSearch] = useState<string>("");

  const dispatchAsync = useAppDispatch();

  const audios = useSelector<RootState, AudioType[] | null>((state) => {
    state.media.audios;
  });

  const handleSearch = () => {
    console.log(search);
  };

  return (
    <div
      className="absolute top-[20px] left-[150px] w-[400px] border-2 border-[#242424] p-2 flex justify-start items-center gap-5 bg-[#242424] rounded-full
                    focus-within:border-white"
    >
      <div
        className="w-[10%] h-[10%] flex justify-center items-center hover:cursor-pointer hover:text-[#1ed760]"
        onClick={() => {
          handleSearch();
        }}
      >
        <IoIosSearch size={25} />
      </div>
      <input
        value={search}
        type="text"
        placeholder="What do you want to listen to ?"
        className="text-sm group w-[80%] bg-[#242424] focus:outline-0"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      {search !== "" && (
        <div
          className="relative right-3 hover:font-black hover:scale-125 hover:cursor-pointer"
          onClick={() => {
            setSearch("");
          }}
        >
          <IoMdClose />
        </div>
      )}
    </div>
  );
};

export default SearchBar;

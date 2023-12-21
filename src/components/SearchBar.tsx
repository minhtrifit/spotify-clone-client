import { IoIosSearch, IoMdClose } from "react-icons/io";

import { useAppDispatch } from "../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { getAllAlbums, getAllAudios } from "../redux/reducers/media.reducer";

import { Audio as AudioType } from "../types/media";
import { Album as AlbumType } from "../types/media";

interface PropType {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  setTriggerSearch: React.Dispatch<React.SetStateAction<boolean>>;

  setSearchAudios: React.Dispatch<
    React.SetStateAction<AudioType[] | undefined>
  >;

  setSearchAlbums?: React.Dispatch<
    React.SetStateAction<AlbumType[] | undefined>
  >;
}

const SearchBar = (props: PropType) => {
  const {
    search,
    setSearch,
    setTriggerSearch,
    setSearchAudios,
    setSearchAlbums,
  } = props;

  const dispatchAsync = useAppDispatch();

  const params = window.location.href;

  const audios = useSelector<RootState, AudioType[] | null>(
    (state) => state.media.audios
  );

  const albums = useSelector<RootState, AlbumType[] | null>(
    (state) => state.media.albums
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTriggerSearch(true);

    if (audios?.length === 0) dispatchAsync(getAllAudios());
    if (albums?.length === 0) dispatchAsync(getAllAlbums());

    const filterAudio = audios?.filter((audio) => {
      return audio.name.toLowerCase().includes(search.toLowerCase());
    });

    const filterAlbum = albums?.filter((album) => {
      return album.name.toLowerCase().includes(search.toLowerCase());
    });

    setSearchAudios(filterAudio);
    setSearchAlbums && setSearchAlbums(filterAlbum);
  };

  return (
    <form
      onSubmit={(e) => {
        handleSearch(e);
      }}
    >
      <div
        className={`w-[300px] md:top-[20px] md:left-[150px] md:w-[400px] border-2 border-[#242424] p-2 flex justify-start items-center gap-5 bg-[#242424] rounded-full
        focus-within:border-white ${
          !params.includes("/add/playlist") && "absolute left-3 top-[80px]"
        }`}
      >
        <button
          className="w-[10%] h-[10%] flex justify-center items-center hover:cursor-pointer hover:text-[#1ed760]"
          type="submit"
        >
          <IoIosSearch size={25} />
        </button>
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
              setTriggerSearch(false);

              setSearchAudios([]);
              setSearchAlbums && setSearchAlbums([]);
            }}
          >
            <IoMdClose />
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;

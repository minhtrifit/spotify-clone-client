import { useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { Audio as AudioType } from "../types/media";
import { Album as AlbumType } from "../types/media";

import SearchBar from "./SearchBar";
import MediaCard from "./MediaCard";
import SkeletonLoading from "./SkeletonLoading";

const MainSearch = () => {
  const [search, setSearch] = useState<string>("");
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false);

  const [searchAudios, setSearchAudios] = useState<AudioType[] | undefined>([]);
  const [searchAlbums, setSearchAlbums] = useState<AlbumType[] | undefined>([]);

  const isLoading = useSelector<RootState, boolean>(
    (state) => state.media.isLoading
  );

  return (
    <div className="px-6 mt-10">
      <SearchBar
        search={search}
        setSearch={setSearch}
        setTriggerSearch={setTriggerSearch}
        setSearchAudios={setSearchAudios}
        setSearchAlbums={setSearchAlbums}
      />

      {isLoading && <SkeletonLoading />}

      {!triggerSearch && (
        <div className="mt-20 mb-[200px] w-[100%] flex justify-center">
          <p className="text-xl font-bold">Search to begin listen...</p>
        </div>
      )}

      {search !== "" &&
        triggerSearch &&
        searchAudios?.length === 0 &&
        searchAlbums?.length === 0 && (
          <div className="mt-20 mb-[200px] w-[100%] flex justify-center">
            <p className="text-xl font-bold">Not found...</p>
          </div>
        )}

      <div className="flex flex-wrap gap-5">
        {searchAudios !== undefined && searchAudios?.length !== 0 && (
          <MediaCard
            title="Related Audio"
            type="audio"
            list={searchAudios}
            max={null}
          />
        )}

        {searchAlbums !== undefined && searchAlbums?.length !== 0 && (
          <MediaCard
            title="Related Album"
            type="album"
            list={searchAlbums}
            max={null}
          />
        )}
      </div>
    </div>
  );
};

export default MainSearch;

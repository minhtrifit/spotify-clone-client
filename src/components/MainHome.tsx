import { useEffect } from "react";

import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { RootState } from "../redux/store";

import { getAllAudios, getAllAlbums } from "../redux/reducers/media.reducer";

import { Audio, Album } from "../types/media";

import MediaCard from "./MediaCard";

const MainHome = () => {
  const dispatchAsync = useAppDispatch();

  const audioList = useSelector<RootState, Audio[]>(
    (state) => state.media.audios
  );

  const albumList = useSelector<RootState, Album[]>(
    (state) => state.media.albums
  );

  useEffect(() => {
    dispatchAsync(getAllAudios());
    dispatchAsync(getAllAlbums());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-6 mt-10 flex flex-col gap-20">
      <MediaCard title="Featured Audio" type="audio" list={audioList} />
      <MediaCard title="Featured Album" type="album" list={albumList} />
    </div>
  );
};

export default MainHome;

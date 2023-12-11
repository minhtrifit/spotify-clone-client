import { useEffect } from "react";

import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { RootState } from "../redux/store";

import { getAllAudios, getAllAlbums } from "../redux/reducers/media.reducer";
import { handleAccessToken } from "../redux/reducers/user.reducer";

import { axiosInterReq, axiosInterRes } from "../helpers/axios";

import { Audio, Album } from "../types/media";

import MediaCard from "./MediaCard";
import SkeletonLoading from "./SkeletonLoading";

const MainHome = () => {
  const dispatchAsync = useAppDispatch();

  const audioList = useSelector<RootState, Audio[]>(
    (state) => state.media.audios
  );

  const albumList = useSelector<RootState, Album[]>(
    (state) => state.media.albums
  );

  const isLoading = useSelector<RootState, boolean>(
    (state) => state.media.isLoading
  );

  axiosInterReq;
  axiosInterRes;

  useEffect(() => {
    dispatchAsync(getAllAudios());
    dispatchAsync(getAllAlbums());
    dispatchAsync(handleAccessToken());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-6 mt-10 flex flex-col gap-20">
      {isLoading ? (
        <SkeletonLoading />
      ) : (
        <MediaCard title="Featured Audio" type="audio" list={audioList} />
      )}

      {isLoading ? (
        <SkeletonLoading />
      ) : (
        <MediaCard title="Featured Album" type="album" list={albumList} />
      )}
    </div>
  );
};

export default MainHome;

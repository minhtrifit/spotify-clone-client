import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useAppDispatch } from "../redux/hooks";

import { getAllAudios, getAllAlbums } from "../redux/reducers/media.reducer";

import { Audio as AudioType } from "../types/media";
import { Album as AlbumType } from "../types/media";

import MediaCard from "./MediaCard";
import SkeletonLoading from "./SkeletonLoading";

const ViewAll = () => {
  const params = useParams();

  const { type } = params;

  const dispatchAsync = useAppDispatch();

  const isLoading = useSelector<RootState, boolean>(
    (state) => state.media.isLoading
  );

  const audios = useSelector<RootState, AudioType[]>(
    (state) => state.media.audios
  );

  const albums = useSelector<RootState, AlbumType[]>(
    (state) => state.media.albums
  );

  useEffect(() => {
    if (type === "audio") dispatchAsync(getAllAudios());
    if (type === "album") dispatchAsync(getAllAlbums());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <div className="px-6 flex ">
      {isLoading ? (
        <SkeletonLoading />
      ) : (
        <>
          {type === "audio" && (
            <MediaCard
              title="All Audio"
              type="audio"
              list={audios}
              max={null}
            />
          )}

          {type === "album" && (
            <MediaCard
              title="All Audio"
              type="album"
              list={albums}
              max={null}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ViewAll;

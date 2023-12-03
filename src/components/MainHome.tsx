import { useEffect } from "react";

import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { RootState } from "../redux/store";
import { getAllAudios } from "../redux/reducers/media.reducer";

import { Audio } from "../types/media";

import MediaCard from "./MediaCard";

const MainHome = () => {
  const dispatchAsync = useAppDispatch();

  const audioList = useSelector<RootState, Audio[]>(
    (state) => state.media.audios
  );

  useEffect(() => {
    dispatchAsync(getAllAudios());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <MediaCard title="Featured Audio" type="audio" list={audioList} />
    </div>
  );
};

export default MainHome;

import { useEffect } from "react";

import { useAppDispatch } from "../redux/hooks";
import { getAllAudios } from "../redux/reducers/media.reducer";

import AudioList from "./AudioList";

const MainHome = () => {
  const dispatchAsync = useAppDispatch();

  useEffect(() => {
    dispatchAsync(getAllAudios());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <AudioList title="Featured Audio" />
    </div>
  );
};

export default MainHome;

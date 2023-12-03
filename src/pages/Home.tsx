import { useState } from "react";

import Split from "react-split";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { Audio as AudioType } from "../types/media";

import Slidebar from "../components/Slidebar";
import Content from "../components/Content";
import Audio from "../components/Audio";

const Home = () => {
  const [active, setActive] = useState<string>("home");

  const audio = useSelector<RootState, AudioType | null>(
    (state) => state.media.targetAudio
  );

  return (
    <div>
      <Split
        className="w-full h-[calc(100vh-100px)] flex p-2 justify-center"
        sizes={[15, 85]}
        minSize={100}
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
      >
        <Slidebar active={active} setActive={setActive} />
        <Content />
      </Split>
      <div className="fixed bottom-0 h-[100px] w-[100%] flex justify-between">
        <div className="hidden md:flex w-[400px] items-center gap-3 ml-3">
          {audio !== null && (
            <>
              <div className="w-[60px] h-[60px] border border-solid rounded-md">
                <img
                  className="w-[100%] rounded-md"
                  src={audio.avatar}
                  alt="audio"
                />
              </div>
              <div>
                <p>{audio.name}</p>
                <p className="text-[13px] font-thin text-gray-400">
                  {audio.artists && audio.artists[0].name}
                </p>
              </div>
            </>
          )}
        </div>
        <Audio />
      </div>
    </div>
  );
};

export default Home;

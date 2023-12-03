import { Routes, Route } from "react-router-dom";

import Header from "./Header";

import MainHome from "./MainHome";
import MainSearch from "./MainSearch";
import DetailAudio from "../pages/DetailAudio";
import DetailAlbum from "../pages/DetailAlbum";

const Content = () => {
  return (
    <div className="w-[100%] max-h-screen bg-[#121212] rounded-md py-4 overflow-y-auto">
      <Header />
      <div className="mt-[15px]">
        <Routes>
          <Route path="/" element={<MainHome />} />
          <Route path="/search" element={<MainSearch />} />
          <Route path="/audio/:id" element={<DetailAudio />} />
          <Route path="/album/:id" element={<DetailAlbum />} />
        </Routes>
      </div>
    </div>
  );
};

export default Content;

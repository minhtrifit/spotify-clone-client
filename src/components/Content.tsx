import { Routes, Route } from "react-router-dom";

import Header from "./Header";

import MainHome from "./MainHome";
import MainSearch from "./MainSearch";
import DetailAudio from "../pages/DetailAudio";

const Content = () => {
  return (
    <div className="w-[100%] max-h-screen bg-[#121212] rounded-md py-4 px-6 overflow-y-auto">
      <Header />
      <div className="mt-[60px]">
        <Routes>
          <Route path="/" element={<MainHome />} />
          <Route path="/search" element={<MainSearch />} />
          <Route path="/audio/:id" element={<DetailAudio />} />
        </Routes>
      </div>
    </div>
  );
};

export default Content;

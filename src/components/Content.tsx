import { Routes, Route } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

import MainHome from "./MainHome";
import MainSearch from "./MainSearch";
import DetailAudio from "../pages/DetailAudio";
import DetailAlbum from "../pages/DetailAlbum";
import Management from "../pages/Management";
import DetailPlaylist from "../pages/DetailPlaylist";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import ViewAll from "./ViewAll";
import AddPlaylistBoard from "./AddPlaylistBoard/AddPlaylistBoard";

const Content = () => {
  return (
    <div className="relative w-[100%] max-h-screen bg-[#121212] rounded-md py-4 overflow-y-auto">
      <Header />
      <div className="mt-[15px]">
        <Routes>
          <Route path="/" element={<MainHome />} />
          <Route path="/search" element={<MainSearch />} />
          <Route path="/audio/:id" element={<DetailAudio />} />
          <Route path="/album/:id" element={<DetailAlbum />} />
          <Route path="/all/:type" element={<ViewAll />} />
          <Route path="/playlist/:id" element={<DetailPlaylist />} />
          <Route
            path="/management/:type"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute roles={["ROLE_ADMIN"]}>
                  <Management />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add/:type"
            element={
              <ProtectedRoute>
                <AddPlaylistBoard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default Content;

import { Link, useNavigate } from "react-router-dom";

import { FaSpotify } from "react-icons/fa";
import { BiSearchAlt2, BiSolidSearch, BiLibrary } from "react-icons/bi";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoMdAdd } from "react-icons/io";

interface Proptype {
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
}

const Slidebar = (props: Proptype) => {
  const { active, setActive } = props;

  const nagivate = useNavigate();

  return (
    <div className="hidden min-w-[250px] max-h-screen md:flex flex-col gap-2">
      <div className="bg-[#121212] rounded-md py-6 px-6">
        <Link to="/">
          <div className="flex items-center gap-[3px]">
            <p>
              <FaSpotify size={25} />
            </p>
            <p className="text-md">Spotify</p>
          </div>
        </Link>

        <div className="mt-[25px] text-[15px] flex flex-col gap-8">
          <div
            className={`flex justify-start items-center hover:cursor-pointer ${
              active === "home" && "font-semibold"
            }`}
            onClick={() => {
              setActive("home");
              nagivate("/");
            }}
          >
            <p className="w-[40px]">
              {active === "home" ? (
                <GoHomeFill size={30} />
              ) : (
                <GoHome size={30} />
              )}
            </p>
            <p className="ml-3">Home</p>
          </div>
          <div
            className={`flex justify-start items-center hover:cursor-pointer ${
              active === "search" && "font-semibold"
            }`}
            onClick={() => {
              setActive("search");
              nagivate("/search");
            }}
          >
            <p className="w-[40px]">
              {active === "search" ? (
                <BiSolidSearch size={30} />
              ) : (
                <BiSearchAlt2 size={30} />
              )}
            </p>
            <p className="ml-3">Search</p>
          </div>
        </div>
      </div>

      <div className="h-[100%] text-[15px] bg-[#121212] rounded-md py-4 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 hover:cursor-pointer hover:font-semibold">
            <BiLibrary size={30} />
            <p>Your Library</p>
          </div>

          <div className="hover:cursor-pointer">
            <IoMdAdd size={25} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slidebar;

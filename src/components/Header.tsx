import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { User } from "../types/user";

const Header = () => {
  const navigate = useNavigate();

  const userProfile = useSelector<RootState, User | null>(
    (state) => state.user.profile
  );

  return (
    <div
      className={`w-[100%] h-[50px] px-6 top-3 flex items-center justify-between`}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-[35px] h-[35px] bg-black rounded-full flex justify-center items-center hover:cursor-pointer"
          onClick={() => {
            window.history.back();
          }}
        >
          <IoChevronBackOutline size={25} />
        </div>
        <div className="w-[35px] h-[35px] bg-black rounded-full flex justify-center items-center hover:cursor-pointer">
          <IoChevronForwardOutline
            size={25}
            onClick={() => {
              window.history.forward();
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-10">
        {userProfile ? (
          <>
            <p>{userProfile.username}</p>
          </>
        ) : (
          <>
            <div
              className="text-gray-400 font-semibold
                    hover:cursor-pointer hover:text-white transform transition duration-200 hover:scale-110"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign up
            </div>

            <div
              className="bg-white text-black font-semibold py-3 px-8 rounded-[100px]
                    hover:cursor-pointer transform transition duration-200 hover:scale-110"
              onClick={() => {
                navigate("/login");
              }}
            >
              Log in
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;

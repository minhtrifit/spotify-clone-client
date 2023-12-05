import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { FaSpotify } from "react-icons/fa";
import { BiShowAlt, BiHide } from "react-icons/bi";
import { useState } from "react";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSubmit = (data: any) => {
    console.log("Submitted data:", data);
    resetField("email");
    resetField("password");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#242424] to-[#000]">
      <header className="bg-black px-12 py-8">
        <Link to="/">
          <div className="flex items-center gap-[3px]">
            <p>
              <FaSpotify size={40} />
            </p>
            <p className="text-2xl font-bold">Spotify</p>
          </div>
        </Link>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-[100%] sm:w-[600px] md:w-[700px] rounded-md sm:mt-10 py-12 px-10 bg-black flex flex-col items-center"
      >
        <p className="text-[40px] font-bold">Log in to Spotify</p>

        <div className="mt-10 w-[100%] flex flex-col items-center">
          <div className="w-[100%] h-[120px] md:w-[45%] flex flex-col gap-3">
            <p className="text-sm font-semibold">Email or username</p>
            <input
              className={`w-[100%] bg-[#242424] px-4 py-2 border border-solid border-gray-500 rounded-md ${
                errors?.email?.message && "border-red-500"
              }`}
              type="text"
              placeholder="Email or username"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors?.email?.message && (
              <p className="text-red-500">{errors.email.message.toString()}</p>
            )}
          </div>

          <div className="relative w-[100%] h-[120px] md:w-[45%] flex flex-col gap-3">
            <p className="text-sm font-semibold">Password</p>
            <input
              className={`w-[100%] bg-[#242424] px-4 py-2 border border-solid border-gray-500 rounded-md ${
                errors?.email?.message && "border-red-500"
              }`}
              type={`${showPassword ? "text" : "password"}`}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            <div
              className="absolute right-5 top-[40px] hover:cursor-pointer"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? <BiShowAlt size={25} /> : <BiHide size={25} />}
            </div>
            {errors?.password?.message && (
              <p className="text-red-500">
                {errors.password.message.toString()}
              </p>
            )}
          </div>

          <div className="w-[45%]">
            <label className="relative inline-flex items-center self-start cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                onChange={(e) => {
                  console.log(e);
                }}
              />
              <div
                className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-blue-300
                      dark:peer-focus:ring-[#1ed760] rounded-full peer dark:bg-gray-700
                      peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                      peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px]
                      after:start-[2px] after:bg-black after:border-black after:border
                      after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-black peer-checked:bg-[#1ed760]"
              ></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Remember me
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="mt-10 w-[45%] bg-[#1ed760] py-3 text-black font-semibold rounded-3xl
                      transform transition duration-200 hover:scale-105"
          >
            Log In
          </button>
        </div>

        <div className="w-[90%] h-[1px] my-10 bg-gray-500"></div>

        <div className="flex gap-2">
          <p className="text-gray-400">Don't have an account?</p>
          <Link to="/signup" className="underline hover:text-[#1ed760]">
            Sign up for Spotify
          </Link>
        </div>
      </form>

      <div className="text-center text-[12px] text-gray-400 mt-10 py-10 flex flex-wrap justify-center gap-1">
        <p>This site is protected by reCAPTCHA and the Google</p>
        <p className="underline">Privacy Policy</p>
        <p>and</p>
        <p className="underline">Terms of Service</p>
        <p>apply.</p>
      </div>
    </div>
  );
};

export default Login;

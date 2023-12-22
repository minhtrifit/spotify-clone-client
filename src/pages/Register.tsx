import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { useAppDispatch } from "../redux/hooks";

import { registerAccount } from "../redux/reducers/user.reducer";
import { User } from "../types/user";

import { FaSpotify } from "react-icons/fa";
import { BiShowAlt, BiHide } from "react-icons/bi";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    watch,
  } = useForm();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const password = useRef({});
  password.current = watch("password", "");

  const dispatchAsync = useAppDispatch();

  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    const adminPasscode = data.admin;
    let roles = "";

    if (adminPasscode === "") roles = "ROLE_USER";
    if (adminPasscode !== "" && adminPasscode !== "admin") {
      toast.error("Wrong admin code");
      return;
    }

    if (adminPasscode !== "" && adminPasscode === "admin") roles = "ROLE_ADMIN";

    const account: User = {
      username: data?.username,
      password: data?.password,
      email: data?.email,
      roles: roles,
    };

    const registerPromise = dispatchAsync(registerAccount(account));

    registerPromise.then((res) => {
      if (res.type === "users/registerAccount/fulfilled") {
        toast.success("Register acccount successfully");
        navigate("/login");
      }

      if (res.type === "users/registerAccount/rejected") {
        toast.error("Wrong username or password");
      }
    });

    resetField("email");
    resetField("username");
    resetField("password");
    resetField("confirm");
    resetField("admin");
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
        <p className="text-[40px] font-bold">Sign up to Spotify</p>

        <div className="mt-10 w-[100%] flex flex-col items-center">
          <div className="w-[100%] h-[120px] md:w-[45%] flex flex-col gap-3">
            <p className="text-sm font-semibold">Username</p>
            <input
              className={`w-[100%] bg-[#242424] px-4 py-2 border border-solid border-gray-500 rounded-md ${
                errors?.username?.message && "border-red-500"
              }`}
              type="text"
              placeholder="Username"
              {...register("username", {
                required: "Username is required",
              })}
            />
            {errors?.username?.message && (
              <p className="text-red-500">
                {errors.username.message.toString()}
              </p>
            )}
          </div>

          <div className="w-[100%] h-[120px] md:w-[45%] flex flex-col gap-3">
            <p className="text-sm font-semibold">Email</p>
            <input
              className={`w-[100%] bg-[#242424] px-4 py-2 border border-solid border-gray-500 rounded-md ${
                errors?.email?.message && "border-red-500"
              }`}
              type="text"
              placeholder="Email"
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

          <div className="relative w-[100%] h-[120px] md:w-[45%] flex flex-col gap-3">
            <p className="text-sm font-semibold">Confirm Password</p>
            <input
              className={`w-[100%] bg-[#242424] px-4 py-2 border border-solid border-gray-500 rounded-md ${
                errors?.confirm?.message && "border-red-500"
              }`}
              type={`${showConfirm ? "text" : "password"}`}
              placeholder="Confirm password"
              {...register("confirm", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password.current || "Confirm password do not match",
              })}
            />
            <div
              className="absolute right-5 top-[40px] hover:cursor-pointer"
              onClick={() => {
                setShowConfirm(!showConfirm);
              }}
            >
              {showConfirm ? <BiShowAlt size={25} /> : <BiHide size={25} />}
            </div>
            {errors?.confirm?.message && (
              <p className="text-red-500">
                {errors.confirm.message.toString()}
              </p>
            )}
          </div>

          <div className="w-[100%] h-[120px] md:w-[45%] flex flex-col gap-3">
            <p className="text-sm font-semibold">Admin code (optional)</p>
            <input
              className={`w-[100%] bg-[#242424] px-4 py-2 border border-solid border-gray-500 rounded-md ${
                errors?.admin?.message && "border-red-500"
              }`}
              type="text"
              placeholder="Admin code"
              {...register("admin")}
            />
            {errors?.admin?.message && (
              <p className="text-red-500">{errors.admin.message.toString()}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-10 w-[45%] bg-[#1ed760] py-3 text-black font-semibold rounded-3xl
                      transform transition duration-200 hover:scale-105"
          >
            Sign up
          </button>
        </div>

        <div className="w-[90%] h-[1px] my-10 bg-gray-500"></div>

        <div className="flex gap-2">
          <p className="text-gray-400">Already have an account?</p>
          <Link to="/login" className="underline hover:text-[#1ed760]">
            Log in to Spotify
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

export default Register;

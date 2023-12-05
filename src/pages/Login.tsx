import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { FaSpotify } from "react-icons/fa";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Submitted data:", data);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#242424] to-[#121212]">
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
        className="mx-auto w-[100%] sm:w-[600px] md:w-[800px] rounded-md sm:mt-10 py-12 px-10 bg-black flex flex-col items-center"
      >
        <p className="text-[40px] font-bold">Log in to Spotify</p>

        <div className="mt-10 w-[100%] flex flex-col gap-5 items-center">
          <div className="w-[100%] md:w-[45%] flex flex-col gap-3">
            <p className="text-sm font-semibold">Email & username</p>
            <input
              className="w-[100%] bg-[#242424] px-4 py-2 border border-solid border-gray-500 rounded-md"
              type="email"
              placeholder="Email or username"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors?.email?.message && (
              <p style={{ color: "red" }}>{errors.email.message.toString()}</p>
            )}
          </div>

          <div className="w-[100%] md:w-[45%] flex flex-col gap-3">
            <p className="text-sm font-semibold">Password</p>
            <input
              className="w-[100%] bg-[#242424] px-4 py-2 border border-solid border-gray-500 rounded-md"
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            {errors?.password?.message && (
              <p style={{ color: "red" }}>
                {errors.password.message.toString()}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="mt-5 w-[45%] bg-[#1ed760] py-3 text-black font-semibold rounded-3xl
                      transform transition duration-200 hover:scale-105"
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

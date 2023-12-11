import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";

import { IoMdClose } from "react-icons/io";

import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { RootState } from "../redux/store";
import {
  editArtist,
  getAllArtists,
  getArtistById,
} from "../redux/reducers/media.reducer";

import { Artist } from "../types/media";
import { uploadImage } from "../redux/reducers/upload.reducer";
import { toast } from "react-toastify";

interface PropType {
  targetArtist: Artist | null;
  openEditArtistModal: boolean;
  setOpenEditArtistModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "#000",
    color: "#fff",
    maxHeight: "80vh",
  },
};

const EditArtistModal = (props: PropType) => {
  const { targetArtist, openEditArtistModal, setOpenEditArtistModal } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatchAsync = useAppDispatch();

  const artist = useSelector<RootState, Artist | null>(
    (state) => state.media.targetArtist
  );

  // Get detail artist
  useEffect(() => {
    if (targetArtist !== null && targetArtist.id) {
      dispatchAsync(getArtistById(targetArtist.id));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetArtist]);

  useEffect(() => {
    if (artist !== null && artist.avatar) {
      setPreviewImage(artist.avatar);
    }
  }, [artist]);

  const handlePreviewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const closeModal = () => {
    setOpenEditArtistModal(false);
  };

  const onSubmit = async (data: any) => {
    const name = data.name;
    const followers = data.followers;
    const picture = data.picture;

    if (
      artist &&
      name === artist?.name &&
      followers === artist?.followers?.toString() &&
      previewImage === artist?.avatar
    ) {
      console.log("Not edit");
      return;
    }

    const formData = new FormData();
    formData.append("file", picture[0]);

    setIsLoading(true);

    // Update image
    try {
      let imageUrl: string = "";

      if (previewImage !== artist?.avatar) {
        const res = await dispatchAsync(uploadImage(formData)).unwrap();
        imageUrl = `${import.meta.env.VITE_API_URL}/upload/files/${res.data}`;
      } else {
        imageUrl = artist.avatar;
      }

      if (artist) {
        const editArtistData: Artist = {
          id: artist.id,
          name: name,
          followers: followers,
          avatar: imageUrl,
        };

        const resEdit = await dispatchAsync(editArtist(editArtistData));

        if (resEdit.type === "artists/EditArtist/fulfilled") {
          // Reload new artist list
          await dispatchAsync(getAllArtists());

          toast.success("Edit artist successfully");
        }

        if (resEdit.type === "artists/EditArtist/rejected") {
          toast.error("Edit artist failed");
        }

        setIsLoading(false);

        setOpenEditArtistModal(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      toast.error("Upload image failed");
    }
  };

  return (
    <Modal
      isOpen={openEditArtistModal}
      onRequestClose={closeModal}
      style={customStyles}
      ariaHideApp={false}
    >
      {artist === null ? (
        <div>
          <p className="text-red-500">Not found artist</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <button className="self-end" onClick={closeModal}>
            <IoMdClose />
          </button>

          <p className="text-2xl font-bold text-center ">Edit Artist</p>

          <form
            className="w-[400px] md:w-[500px] px-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col items-center">
              <div className="w-[100%] h-[120px] flex flex-col gap-3">
                <p className="text-sm font-semibold">Name</p>
                <input
                  className={`w-[100%] bg-[#242424] px-4 py-2 border border-solid border-gray-500 rounded-md ${
                    errors?.name?.message && "border-red-500"
                  }`}
                  type="text"
                  placeholder="Audio name"
                  defaultValue={artist.name}
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
                {errors?.name?.message && (
                  <p className="text-red-500">
                    {errors.name.message.toString()}
                  </p>
                )}
              </div>

              <div className="w-[100%] h-[120px] flex flex-col gap-3">
                <p className="text-sm font-semibold">Followers</p>
                <input
                  className={`w-[100%] bg-[#242424] px-4 py-2 border border-solid border-gray-500 rounded-md ${
                    errors?.followers?.message && "border-red-500"
                  }`}
                  type="text"
                  placeholder="Followers"
                  defaultValue={artist.followers}
                  {...register("followers", {
                    pattern: /^(0|[1-9]\d*)(\.\d+)?$/,
                    required: "Followers is required",
                  })}
                />
                {errors?.followers?.message && (
                  <p className="text-red-500">
                    {errors.followers.message.toString()}
                  </p>
                )}
              </div>

              <div className="w-[100%] h-[120px] flex flex-col gap-3">
                <p className="text-sm font-semibold">Avatar</p>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                file:text-sm file:font-semibold file:bg-[#1ed760] file:text-black hover:file:bg-[#19fa6a]
                file:disabled:opacity-50 file:disabled:pointer-events-none"
                  {...register("picture", {
                    // required: "Avatar is required",
                    validate: (value) => {
                      if (previewImage !== "") {
                        return true;
                      }

                      const acceptedFormats = ["png", "jpg", "jpeg"];
                      const fileExtension = value[0]?.name
                        .split(".")
                        .pop()
                        .toLowerCase();
                      if (!acceptedFormats.includes(fileExtension)) {
                        return "Invalid file format. Only image files are allowed.";
                      }
                      return true;
                    },
                    onChange: (e) => {
                      handlePreviewImage(e);
                    },
                  })}
                />
                {errors?.picture?.message && (
                  <p className="text-red-500">
                    {errors.picture.message.toString()}
                  </p>
                )}
              </div>

              {previewImage && (
                <div className="w-[100%] h-[100px] flex flex-col gap-3">
                  <img
                    src={previewImage}
                    alt="preview"
                    className="max-w-[100px]"
                  />
                </div>
              )}

              <button
                type="submit"
                className="mt-10 w-[45%] bg-[#1ed760] py-3 text-black font-semibold rounded-3xl
                  transform transition duration-200 hover:scale-105"
              >
                {isLoading ? "Loading..." : "Edit"}
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
};

export default EditArtistModal;

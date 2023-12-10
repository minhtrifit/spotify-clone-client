import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";

import { IoMdClose } from "react-icons/io";

import { useAppDispatch } from "../redux/hooks";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { Album, Artist, Audio } from "../types/media";

import { uploadImage, uploadAudio } from "../redux/reducers/upload.reducer";
import {
  addNewAudio,
  getAllAlbums,
  getAllArtists,
  getAllAudios,
} from "../redux/reducers/media.reducer";

interface PropType {
  openAddAudioModal: boolean;
  setOpenAddAudioModal: React.Dispatch<React.SetStateAction<boolean>>;
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

const AddAudioModal = (props: PropType) => {
  const { openAddAudioModal, setOpenAddAudioModal } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    control,
  } = useForm();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [artistOption, setArtistOption] = useState<any[]>([]);
  const [albumOption, setAlbumOption] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const artistList = useSelector<RootState, Artist[]>(
    (state) => state.media.artists
  );

  const albumList = useSelector<RootState, Album[]>(
    (state) => state.media.albums
  );

  const dispatchAsync = useAppDispatch();
  const dispatch = useDispatch();

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
    setOpenAddAudioModal(false);
  };

  const onSubmit = (data: any) => {
    const name = data.name;
    const artists = data.artists;
    const albums = data.albums;
    const audio = data.audio;
    const picture = data.picture;

    const audioFormData = new FormData();
    audioFormData.append("file", audio[0]);

    const pictureFormData = new FormData();
    pictureFormData.append("file", picture[0]);

    setIsLoading(true);

    // Update audio
    const uploadAudioPromise = dispatchAsync(uploadAudio(audioFormData));

    // Update image
    const uploadImagePromise = dispatchAsync(uploadImage(pictureFormData));

    uploadAudioPromise.then((res) => {
      // Upload audio successfully
      if (res.type === "uploads/uploadAudio/fulfilled") {
        const audioData = res.payload.url.webContentLink
          .split("/")[3]
          .split("=")[1]
          .split("&")[0];

        const audioUrl = `http://docs.google.com/uc?export=open&id=${audioData}`;

        // Update full audio url: http://docs.google.com/uc?export=open&id=audioData
        dispatch({ type: "upload/updateAudioUrl", payload: audioUrl });

        uploadImagePromise.then((res) => {
          // Upload image successfully
          if (res.type === "uploads/uploadImage/fulfilled") {
            const imageUrl = `${import.meta.env.VITE_API_URL}/upload/files/${
              res.payload.data
            }`;

            // Update full image url: http://localhost:8080/upload/files/res.payload.data
            dispatch({ type: "upload/updateImageUrl", payload: imageUrl });

            const newAudio: Audio = {
              name: name,
              artists: artists.map(
                (a: { value: string; label: string }) => a.value
              ),
              albums: albums.map(
                (a: { value: string; label: string }) => a.value
              ),
              avatar: imageUrl,
              url: audioUrl,
            };

            // Add new audio
            const addNewAudioPromise = dispatchAsync(addNewAudio(newAudio));

            addNewAudioPromise.then((res) => {
              if (res.type === "audios/addNewAudio/fulfilled") {
                setIsLoading(false);

                toast.success("Add new audio successfully");

                // Reset url state
                dispatch({ type: "upload/updateImageUrl", payload: "" });
                dispatch({ type: "upload/updateAudioUrl", payload: "" });

                setOpenAddAudioModal(false);

                // Upload new audio list
                dispatchAsync(getAllAudios());
              }

              if (res.type === "audios/addNewAudio/rejected") {
                toast.error("Add new audio failed");
                setIsLoading(false);
              }
            });
          }

          if (res.type === "uploads/uploadImage/rejected") {
            toast.error("Upload avatar failed");
            setIsLoading(false);
          }
        });
      }
    });

    resetField("name");
    resetField("artists");
    resetField("albums");
    resetField("audio");
    resetField("picture");
    setPreviewImage("");
  };

  useEffect(() => {
    dispatchAsync(getAllArtists());
    dispatchAsync(getAllAudios());
    dispatchAsync(getAllAlbums());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (artistList.length !== 0) {
      const data = artistList?.map((artist) => {
        return { value: artist.id, label: artist.name };
      });

      setArtistOption(data);
    }
  }, [artistList]);

  useEffect(() => {
    if (albumList.length !== 0) {
      const data = albumList?.map((artist) => {
        return { value: artist.id, label: artist.name };
      });

      setAlbumOption(data);
    }
  }, [albumList]);

  return (
    <Modal
      isOpen={openAddAudioModal}
      onRequestClose={closeModal}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="flex flex-col gap-5">
        <button className="self-end" onClick={closeModal}>
          <IoMdClose />
        </button>

        <p className="text-2xl font-bold text-center ">Add New Audio</p>

        <form
          className="w-[400px] md:w-[500px] px-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-center">
            <div className="w-[100%] h-[120px] flex flex-col gap-3">
              <p className="text-sm font-semibold">Name</p>
              <input
                className={`w-[100%] bg-[#242424] px-4 py-2 border border-solid border-gray-500 rounded-md ${
                  errors?.email?.message && "border-red-500"
                }`}
                type="text"
                placeholder="Audio name"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors?.name?.message && (
                <p className="text-red-500">{errors.name.message.toString()}</p>
              )}
            </div>

            <div className="w-[100%] h-[120px] flex flex-col gap-3">
              <p className="text-sm font-semibold">Artists</p>
              <Controller
                control={control}
                name="artists"
                rules={{ required: "Artist is required" }}
                render={({
                  field: { onChange, value, name, ref },
                  fieldState: { error },
                }) => (
                  <>
                    <Select
                      isMulti
                      ref={ref}
                      name={name}
                      options={artistOption}
                      value={value}
                      onChange={onChange}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor: state.isFocused
                            ? "#1ed760"
                            : "rgb(107 114 128)",
                          backgroundColor: "#242424",
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused ? "#f1f1f1" : "#fff",
                          color: state.isFocused ? "#000" : "#333",
                        }),
                      }}
                    />
                    {error?.message && (
                      <p className="text-red-500">{error.message.toString()}</p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="w-[100%] h-[120px] flex flex-col gap-3">
              <p className="text-sm font-semibold">Albums</p>
              <Controller
                control={control}
                name="albums"
                rules={{ required: "Album is required" }}
                render={({
                  field: { onChange, value, name, ref },
                  fieldState: { error },
                }) => (
                  <>
                    <Select
                      isMulti
                      ref={ref}
                      name={name}
                      options={albumOption}
                      value={value}
                      onChange={onChange}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor: state.isFocused
                            ? "#1ed760"
                            : "rgb(107 114 128)",
                          backgroundColor: "#242424",
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused ? "#f1f1f1" : "#fff",
                          color: state.isFocused ? "#000" : "#333",
                        }),
                      }}
                    />
                    {error?.message && (
                      <p className="text-red-500">{error.message.toString()}</p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="w-[100%] flex flex-col gap-3 justify-between">
              <div className="w-[100%] h-[120px] flex flex-col gap-3">
                <p className="text-sm font-semibold">Audio</p>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                file:text-sm file:font-semibold file:bg-[#1ed760] file:text-black hover:file:bg-[#19fa6a]
                file:disabled:opacity-50 file:disabled:pointer-events-none"
                  {...register("audio", {
                    required: "Audio is required",
                    validate: (value) => {
                      const acceptedFormats = ["mp3"];
                      const fileExtension = value[0]?.name
                        .split(".")
                        .pop()
                        .toLowerCase();
                      if (!acceptedFormats.includes(fileExtension)) {
                        return "Invalid file format. Only audio files are allowed.";
                      }
                      return true;
                    },
                  })}
                />
                {errors?.audio?.message && (
                  <p className="text-red-500">
                    {errors.audio.message.toString()}
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
                    required: "Avatar is required",
                    validate: (value) => {
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
              {isLoading ? "Loading..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddAudioModal;

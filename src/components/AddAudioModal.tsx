import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";

import { IoMdClose } from "react-icons/io";

import { useAppDispatch } from "../redux/hooks";
import { useDispatch } from "react-redux";

import { Artist } from "../types/media";

import { uploadImage } from "../redux/reducers/upload.reducer";
import { addNewArtist, getAllArtists } from "../redux/reducers/media.reducer";

interface PropType {
  openAddAudioModal: boolean;
  setOpenAddAudioModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },
  content: {
    top: "40%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "#000",
    color: "#fff",
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

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

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
    console.log(data);
    const name = data.name;
    const audio = data.audio;
    const picture = data.picture;

    const audioFormData = new FormData();
    audioFormData.append("file", audio[0]);

    const pictureFormData = new FormData();
    pictureFormData.append("file", picture[0]);

    // Update audio

    // Update image
    // const uploadImagePromise = dispatchAsync(uploadImage(pictureFormData));

    // uploadImagePromise.then((res) => {
    //   if (res.type === "uploads/uploadImage/fulfilled") {
    //     const imageUrl = `${import.meta.env.VITE_API_URL}/upload/files/${
    //       res.payload.data
    //     }`;

    //     // Update full image url: http://localhost:8080/upload/files/res.payload.data
    //     dispatch({ type: "upload/updateImageUrl", payload: imageUrl });

    //     const newArtist: Artist = {
    //       name: name,
    //       avatar: imageUrl,
    //     };

    //     // Add new artist
    //     const addNewArtistPromise = dispatchAsync(addNewArtist(newArtist));

    //     addNewArtistPromise.then((res) => {
    //       if (res.type === "artists/addNewArtist/fulfilled") {
    //         toast.success("Add new artist successfully");

    //         // Reset image url state
    //         dispatch({ type: "upload/updateImageUrl", payload: "" });

    //         setOpenAddAudioModal(false);
    //       }

    //       if (res.type === "artists/addNewArtist/rejected") {
    //         toast.error("Add new artist failed");
    //       }
    //     });
    //   }

    //   if (res.type === "uploads/uploadImage/rejected") {
    //     toast.error("Upload avatar failed");
    //   }
    // });

    resetField("name");
    resetField("audio");
    resetField("picture");
    setPreviewImage("");
  };

  useEffect(() => {
    dispatchAsync(getAllArtists());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          className="w-[400px] md:w-[500px] p-4"
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
                      options={options}
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
              <p className="text-sm font-semibold">Audio</p>
              <input
                type="file"
                className="block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                file:text-sm file:font-semibold file:bg-[#1ed760] file:text-black hover:file:bg-[#19fa6a]
                file:disabled:opacity-50 file:disabled:pointer-events-none"
                {...register("audio", {
                  required: "Audio is required",
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
              Add
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddAudioModal;

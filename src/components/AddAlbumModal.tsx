import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

import { IoMdClose } from "react-icons/io";

import { useAppDispatch } from "../redux/hooks";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toast } from "react-toastify";

import { Album, Audio } from "../types/media";

import { uploadImage } from "../redux/reducers/upload.reducer";
import { addNewAlbum, getAllAlbums } from "../redux/reducers/media.reducer";

interface PropType {
  openAddAlbumModal: boolean;
  setOpenAddAlbumModal: React.Dispatch<React.SetStateAction<boolean>>;
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
    maxHeight: "80vh",
  },
};

const AddAlbumModal = (props: PropType) => {
  const { openAddAlbumModal, setOpenAddAlbumModal } = props;

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audiosOption, setAudiosOption] = useState<any[]>([]);

  const audioList = useSelector<RootState, Audio[]>(
    (state) => state.media.audios
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
    setOpenAddAlbumModal(false);
  };

  const onSubmit = (data: any) => {
    const name = data.name;
    const audios = data.audios;
    const picture = data.picture;

    const formData = new FormData();
    formData.append("file", picture[0]);

    setIsLoading(true);

    // Update image
    const uploadImagePromise = dispatchAsync(uploadImage(formData));

    uploadImagePromise.then((res) => {
      if (res.type === "uploads/uploadImage/fulfilled") {
        const imageUrl = `${import.meta.env.VITE_API_URL}/upload/files/${
          res.payload.data
        }`;

        // Update full image url: http://localhost:8080/upload/files/res.payload.data
        dispatch({ type: "upload/updateImageUrl", payload: imageUrl });

        const newAlbum: Album = {
          name: name,
          audios: audios.map((a: { value: string; label: string }) => a.value),
          avatar: imageUrl,
        };

        // Add new album
        const addNewAlbumPromise = dispatchAsync(addNewAlbum(newAlbum));

        addNewAlbumPromise.then((res) => {
          if (res.type === "albums/addNewAlbum/fulfilled") {
            setIsLoading(false);

            toast.success("Add new album successfully");

            // Reset image url state
            dispatch({ type: "upload/updateImageUrl", payload: "" });

            setOpenAddAlbumModal(false);

            // Update new album list
            dispatchAsync(getAllAlbums());
          }

          if (res.type === "albums/addNewAlbum/rejected") {
            toast.error("Add new album failed");
            setIsLoading(false);
          }
        });
      }

      if (res.type === "uploads/uploadImage/rejected") {
        toast.error("Upload avatar failed");
        setIsLoading(false);
      }
    });

    resetField("name");
    resetField("picture");
    setPreviewImage("");
  };

  useEffect(() => {
    dispatchAsync(getAllAlbums());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioList.length !== 0) {
      const data = audioList?.map((audio) => {
        return { value: audio.id, label: audio.name };
      });

      setAudiosOption(data);
    }
  }, [audioList]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    control,
  } = useForm();

  return (
    <Modal
      isOpen={openAddAlbumModal}
      onRequestClose={closeModal}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="flex flex-col gap-5">
        <button className="self-end" onClick={closeModal}>
          <IoMdClose />
        </button>

        <p className="text-2xl font-bold text-center ">Add New Album</p>

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
                placeholder="Artist name"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors?.name?.message && (
                <p className="text-red-500">{errors.name.message.toString()}</p>
              )}
            </div>

            <div className="w-[100%] h-[120px] flex flex-col gap-3">
              <p className="text-sm font-semibold">Audios</p>
              <Controller
                control={control}
                name="audios"
                rules={{ required: "Audios is required" }}
                render={({
                  field: { onChange, value, name, ref },
                  fieldState: { error },
                }) => (
                  <>
                    <Select
                      isMulti
                      ref={ref}
                      name={name}
                      options={audiosOption}
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

export default AddAlbumModal;

import { useState } from "react";
import Modal from "react-modal";
import { useForm, Controller } from "react-hook-form";

import { IoMdClose } from "react-icons/io";

interface PropType {
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
  const { openEditArtistModal, setOpenEditArtistModal } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    control,
  } = useForm();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const closeModal = () => {
    setOpenEditArtistModal(false);
  };

  const onSubmit = (data: any) => {
    {
      console.log(data);
    }
  };

  return (
    <Modal
      isOpen={openEditArtistModal}
      onRequestClose={closeModal}
      style={customStyles}
      ariaHideApp={false}
    >
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

export default EditArtistModal;

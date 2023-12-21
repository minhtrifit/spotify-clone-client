import { useEffect, useState } from "react";
import {
  DragStartEvent,
  DragOverEvent,
  // DragEndEvent,
  DropAnimation,
  defaultDropAnimation,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DndContext,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { MdLibraryMusic } from "react-icons/md";

import { uploadImage } from "../../redux/reducers/upload.reducer";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../redux/hooks";
import {
  addNewPlaylist,
  getAllAudiosColumn,
  getAllPlaylistsByUserId,
} from "../../redux/reducers/media.reducer";

import SearchBar from "../SearchBar";

import { Audio as AudioType, Playlist } from "../../types/media";
import { AudioColumnType, ColumnType } from "../../types/playlist";
import { User } from "../../types/user";

import { columnsData } from "../../utils";

import Column from "./Column";
import Card from "./Card";

const AddPlaylistBoard = () => {
  const dispatchAsync = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm();

  const columns: ColumnType[] = columnsData;

  const [audios, setAudios] = useState<AudioColumnType[]>([]);
  const [activeAudio, setActiveAudio] = useState<AudioColumnType | null>(null);

  const [search, setSearch] = useState<string>("");
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false);
  const [searchAudios, setSearchAudios] = useState<AudioType[] | undefined>([]);
  const [sourceAudio, setSourceAudio] = useState<AudioColumnType[]>([]);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const isLoading = useSelector<RootState, boolean>(
    (state) => state.media.isLoading
  );

  const audiosColumn = useSelector<RootState, AudioColumnType[]>(
    (state) => state.media.audiosColumn
  );

  const userProfile = useSelector<RootState, User | null>(
    (state) => state.user.profile
  );

  useEffect(() => {
    dispatchAsync(getAllAudiosColumn(columns[0].id));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkExistAudio = (
    source: AudioColumnType[],
    audio: AudioColumnType
  ) => {
    for (let i = 0; i < source.length; ++i) {
      if (source[i].id === audio.id) {
        return true;
      }
    }

    return false;
  };

  //==================== Search event handling
  useEffect(() => {
    if (searchAudios !== undefined && searchAudios?.length !== 0) {
      const source: AudioColumnType[] = searchAudios?.map((audio) => {
        return { ...audio, columnId: "source" };
      });

      const searchResult = audios.filter((audio) => {
        if (audio.columnId === "source" && checkExistAudio(source, audio))
          return audio;
      });

      const result = audios.filter((audio) => {
        if (audio.columnId === "playlist") return audio;

        if (audio.columnId === "source" && checkExistAudio(searchResult, audio))
          return audio;
      });

      setAudios(result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchAudios]);

  useEffect(() => {
    if (search === "") {
      const inPlaylistAudios = audios.filter((audio) => {
        return audio.columnId === "playlist";
      });

      const inSourceAudios = sourceAudio.filter((audio) => {
        if (!checkExistAudio(inPlaylistAudios, audio)) return audio;
      });

      const result = inSourceAudios.concat(inPlaylistAudios);

      setAudios(result);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerSearch]);

  //==================== Get audios API
  useEffect(() => {
    if (audiosColumn.length !== 0) {
      setAudios(audiosColumn);
      setSourceAudio(audiosColumn);
    }
  }, [audiosColumn]);

  //==================== DnD event handling
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveAudio(audios.filter((audio) => audio.id === active.id)[0]);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeColumnId = active.data.current?.sortable.containerId;
    const activeColumn = columns.filter((col) => col.id === activeColumnId)[0];

    let overColumnId: any = "";
    if (over?.data?.current?.sortable.containerId !== undefined) {
      overColumnId = over?.data?.current?.sortable.containerId;
    } else overColumnId = over.id;

    const overColumn = columns.filter((col) => col.id === overColumnId)[0];

    const overAudioId = over.id;
    const overAudio = audios.filter((audio) => audio.id === overAudioId)[0];

    if (!activeAudio || !activeColumn) return;

    // Drop audio over audio
    if (activeAudio && overAudio && activeAudio !== overAudio) {
      const activeIndex = audios.findIndex((a) => a.id === activeAudio?.id);
      const overIndex = audios.findIndex((a) => a.id === overAudio?.id);

      setAudios(arrayMove(audios, activeIndex, overIndex));
    }

    // Drop audio over column
    if (
      activeAudio &&
      activeColumn &&
      overColumn &&
      activeColumn.id !== overColumn.id
    ) {
      const newAudios = audios.map((audio) => {
        if (audio.id === activeAudio.id) {
          const clone = { ...audio };
          clone.columnId = overColumn.id;
          return clone;
        }
        return audio;
      });

      setAudios(newAudios);
    }
  };

  const handleDragEnd = () => {
    // { active, over }: DragEndEvent
    setActiveAudio(null);
  };

  const audio = activeAudio ? activeAudio : null;

  const handleRemoveAudioFromPlaylist = (id: number) => {
    const newAudios = audios.map((audio) => {
      if (audio.id === id) {
        const clone = { ...audio };
        clone.columnId = "source";
        return clone;
      }
      return audio;
    });

    setAudios(newAudios);
  };

  //==================== Create new playlist
  const handlePreviewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: any) => {
    const name = data.name;
    const picture = data.picture;

    const formData = new FormData();
    formData.append("file", picture[0]);

    const audioList = audios.filter((audio) => {
      return audio.columnId === "playlist";
    });

    if (audioList.length === 0) {
      toast.error("Please drag audio to playlist");
      return;
    }

    const audioFormatted = audioList.map((audio) => {
      return audio.id;
    });

    try {
      // Update image
      const resUploadImage = await dispatchAsync(
        uploadImage(formData)
      ).unwrap();

      if (resUploadImage.status === "ok") {
        const imageUrl = `${import.meta.env.VITE_API_URL}/upload/files/${
          resUploadImage.data
        }`;

        if (userProfile && userProfile.id && audioList) {
          const newPlaylist: Playlist = {
            userId: userProfile.id,
            name: name,
            audios: audioFormatted,
            avatar: imageUrl,
          };

          const resAddNewPlaylist = await dispatchAsync(
            addNewPlaylist(newPlaylist)
          );

          if (resAddNewPlaylist.type === "playlists/addNewPlaylist/fulfilled") {
            toast.success("Create playlist successfully");

            dispatchAsync(getAllPlaylistsByUserId(userProfile.id));
          }

          if (resAddNewPlaylist.type === "playlists/addNewPlaylist/rejected") {
            toast.error("Create playlist failed");
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Create playlist failed");
    }

    resetField("name");
    resetField("picture");
    setPreviewImage("");
    setAudios(sourceAudio);
  };

  return (
    <div className="px-6 mt-20">
      {isLoading ? (
        <div className="flex justify-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col items-center">
          <form
            className="w-[400px] md:w-[750px]"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-5 items-center">
              <div className="w-[100%] bg-[#1a1a1a] flex flex-col gap-5 items-center px-10 md:px-20 py-6 rounded-md mb-[100px]">
                <div className="flex items-center gap-5 mb-10">
                  <p className="text-md md:text-2xl font-black">
                    Create Your Own Sound World
                  </p>
                  <MdLibraryMusic size={30} />
                </div>

                <div className="w-[100%] h-[120px] flex flex-col gap-3">
                  <p className="text-sm font-semibold">Name</p>
                  <input
                    className={`w-[100%] bg-[#242424] px-4 py-2 border border-solid border-gray-500 rounded-md ${
                      errors?.email?.message && "border-red-500"
                    }`}
                    type="text"
                    placeholder="Name"
                    {...register("name", {
                      required: "Playlist Name is required",
                    })}
                  />
                  {errors?.name?.message && (
                    <p className="text-red-500">
                      {errors.name.message.toString()}
                    </p>
                  )}
                </div>

                <div className="w-[100%] flex justify-between gap-5">
                  <div className="h-[120px] flex flex-col gap-3">
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
                    <div className="h-[100px] flex flex-col gap-3">
                      <img
                        src={previewImage}
                        alt="preview"
                        className="max-w-[100px]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                <div className="flex gap-10 xl:justify-center overflow-x-auto">
                  {columns?.map((col) => {
                    return (
                      <Column
                        key={col.id}
                        column={col}
                        audios={audios.filter(
                          (audio) => audio.columnId === col.id
                        )}
                        handleRemoveAudioFromPlaylist={
                          handleRemoveAudioFromPlaylist
                        }
                      />
                    );
                  })}
                  <DragOverlay dropAnimation={dropAnimation}>
                    {audio ? (
                      <Card
                        audio={audio}
                        handleRemoveAudioFromPlaylist={
                          handleRemoveAudioFromPlaylist
                        }
                      />
                    ) : null}
                  </DragOverlay>
                </div>
              </DndContext>

              <button
                type="submit"
                className="mt-10 w-[45%] bg-[#1ed760] py-3 text-black font-semibold rounded-3xl
                      transform transition duration-200 hover:scale-105"
              >
                {isLoading ? "Loading..." : "Create"}
              </button>
            </div>
          </form>

          <div className="absolute top-[450px]">
            <SearchBar
              search={search}
              setSearch={setSearch}
              setTriggerSearch={setTriggerSearch}
              setSearchAudios={setSearchAudios}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPlaylistBoard;

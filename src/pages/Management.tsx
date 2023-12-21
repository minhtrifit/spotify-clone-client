import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { RootState } from "../redux/store";

import { MdOutlinePlaylistAddCheck } from "react-icons/md";

import {
  getAllArtists,
  deleteArtistById,
  deleteAudioById,
  getAllAudios,
  getAllPlaylistsByUserId,
  deletePlaylistById,
  deleteAlbumById,
  getAllAlbums,
} from "../redux/reducers/media.reducer";

import { Album, Artist, Audio, Playlist } from "../types/media";
import { User } from "../types/user";

import { deleteFileByName } from "../redux/reducers/upload.reducer";

import EditArtistModal from "../components/EditArtistModal";

// import { artistList } from "../utils";

const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const Management = () => {
  const params = useParams();
  const { type } = params;

  const ITEMS_PER_PAGE: number = 5;

  const [heading, setHeading] = useState<{ key: string; value: string }[]>([]);

  const [listPerPage, setListPerPage] = useState<any[]>([]);
  const [pages, setPages] = useState<number[]>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const [targetArtist, setTargetArtist] = useState<Artist | null>(null);

  const [openEditArtistModal, setOpenEditArtistModal] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const dispatchAsync = useAppDispatch();

  const artistList = useSelector<RootState, Artist[]>(
    (state) => state.media.artists
  );

  const audioList = useSelector<RootState, Audio[]>(
    (state) => state.media.audios
  );

  const userProfile = useSelector<RootState, User | null>(
    (state) => state.user.profile
  );

  const userPlaylist = useSelector<RootState, Playlist[]>(
    (state) => state.media.userPlaylist
  );

  const albumList = useSelector<RootState, Album[]>(
    (state) => state.media.albums
  );

  useEffect(() => {
    if (userProfile !== null && userProfile.id) {
      dispatchAsync(getAllPlaylistsByUserId(userProfile.id));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  useEffect(() => {
    if (type?.toLowerCase() === "album") {
      dispatchAsync(getAllAlbums());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (type?.toLowerCase() === "playlist") {
      dispatch({ type: "media/updateAlbums", payload: [] });
      setListPerPage([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (type?.toLowerCase() === "artist" && artistList.length !== 0) {
      const keys = Object.keys(artistList[0]);
      const headingArr = [];

      for (let i = 0; i < keys.length; ++i) {
        headingArr.push({
          key: keys[i],
          value: capitalizeFirstLetter(keys[i]),
        });
      }

      headingArr.push({
        key: "actions",
        value: "Actions",
      });

      setHeading(headingArr);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, artistList]);

  useEffect(() => {
    if (type?.toLowerCase() === "audio" && audioList.length !== 0) {
      const keys = Object.keys(audioList[0]);
      const headingArr = [];

      for (let i = 0; i < keys.length; ++i) {
        headingArr.push({
          key: keys[i],
          value: capitalizeFirstLetter(keys[i]),
        });
      }

      headingArr.push({
        key: "actions",
        value: "Actions",
      });

      setHeading(headingArr);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, audioList]);

  useEffect(() => {
    if (type?.toLowerCase() === "album" && albumList.length !== 0) {
      const keys = Object.keys(albumList[0]);
      const headingArr = [];

      for (let i = 0; i < keys.length; ++i) {
        headingArr.push({
          key: keys[i],
          value: capitalizeFirstLetter(keys[i]),
        });
      }

      headingArr.push({
        key: "actions",
        value: "Actions",
      });

      setHeading(headingArr);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, albumList]);

  useEffect(() => {
    if (type?.toLowerCase() === "playlist" && userPlaylist.length !== 0) {
      const keys = Object.keys(userPlaylist[0]);
      const headingArr = [];

      for (let i = 0; i < keys.length; ++i) {
        if (keys[i] !== "author") {
          headingArr.push({
            key: keys[i],
            value: capitalizeFirstLetter(keys[i]),
          });
        }
      }

      headingArr.push({
        key: "actions",
        value: "Actions",
      });

      setHeading(headingArr);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, userPlaylist]);

  // Get pagination artist list
  useEffect(() => {
    if (type?.toLowerCase() === "artist" && artistList.length !== 0) {
      // Caculate page
      const total = Math.ceil(artistList.length / ITEMS_PER_PAGE);
      setPages(Array.from({ length: total }, (_, i) => i + 1));

      // Init first page list
      const begin = (activePage - 1) * ITEMS_PER_PAGE;
      const end = (activePage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE;
      setListPerPage(artistList.slice(begin, end));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, artistList]);

  // Get pagination audio list
  useEffect(() => {
    if (type?.toLowerCase() === "audio" && audioList.length !== 0) {
      // Caculate page
      const total = Math.ceil(audioList.length / ITEMS_PER_PAGE);
      setPages(Array.from({ length: total }, (_, i) => i + 1));

      // Init first page list
      const begin = (activePage - 1) * ITEMS_PER_PAGE;
      const end = (activePage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE;
      setListPerPage(audioList.slice(begin, end));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, audioList]);

  // Get pagination album list
  useEffect(() => {
    if (type?.toLowerCase() === "album" && albumList.length !== 0) {
      // Caculate page
      const total = Math.ceil(albumList.length / ITEMS_PER_PAGE);
      setPages(Array.from({ length: total }, (_, i) => i + 1));

      // Init first page list
      const begin = (activePage - 1) * ITEMS_PER_PAGE;
      const end = (activePage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE;
      setListPerPage(albumList.slice(begin, end));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, albumList]);

  // Get pagination playlist
  useEffect(() => {
    if (type?.toLowerCase() === "playlist" && userPlaylist.length !== 0) {
      // Caculate page
      const total = Math.ceil(userPlaylist.length / ITEMS_PER_PAGE);
      setPages(Array.from({ length: total }, (_, i) => i + 1));

      // Init first page list
      const begin = (activePage - 1) * ITEMS_PER_PAGE;
      const end = (activePage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE;
      setListPerPage(userPlaylist.slice(begin, end));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, userPlaylist]);

  const handleDeleteArtist = async (
    id: number | undefined,
    fileName: string | undefined
  ) => {
    if (confirm(`Are you sure want to delete artist ${id}?`) == true) {
      if (id !== undefined && fileName !== undefined) {
        try {
          const deleteArtistRes = await dispatchAsync(
            deleteArtistById(id)
          ).unwrap();

          // Refresh artist list
          dispatchAsync(getAllArtists());

          if (deleteArtistRes?.message) {
            toast.success(deleteArtistRes.message);

            // Delete image
            dispatchAsync(deleteFileByName(fileName));
          }
        } catch (error) {
          console.log(error);
          toast.error("Delete artist failed");
        }
      }
    }
  };

  const handleDeleteAudio = async (
    id: number | undefined,
    fileName: string | undefined
  ) => {
    if (confirm(`Are you sure want to delete audio ${id}?`) == true) {
      if (id !== undefined && fileName !== undefined) {
        try {
          const res = await dispatchAsync(deleteAudioById(id)).unwrap();

          // Reload audio list
          dispatchAsync(getAllAudios());

          if (res?.message) {
            toast.success(res.message);

            // Delete image
            dispatchAsync(deleteFileByName(fileName));
          }
        } catch (error) {
          console.log(error);
          toast.error("Delete audio failed");
        }
      }
    }
  };

  const handleDeleteAlbum = async (
    id: number | undefined,
    fileName: string | undefined
  ) => {
    if (confirm(`Are you sure want to delete album ${id}?`) == true) {
      if (id !== undefined && fileName !== undefined) {
        try {
          const res = await dispatchAsync(deleteAlbumById(id)).unwrap();

          // Reload album list
          dispatchAsync(getAllAlbums());

          if (res?.message) {
            toast.success(res.message);

            // Delete image
            dispatchAsync(deleteFileByName(fileName));
          }
        } catch (error) {
          console.log(error);
          toast.error("Delete album failed");
        }
      }
    }
  };

  const handleDeletePlaylist = async (id: number | undefined) => {
    if (confirm(`Are you sure want to delete playlist ${id}?`) == true) {
      if (userProfile?.id && id !== undefined) {
        try {
          const res = await dispatchAsync(deletePlaylistById(id)).unwrap();

          // Reload playlist list
          dispatchAsync(getAllPlaylistsByUserId(userProfile?.id));

          if (res?.message) {
            toast.success(res.message);
          }
        } catch (error) {
          console.log(error);
          toast.error("Delete audio failed");
        }
      }
    }
  };

  const handlePagination = (page: number) => {
    setActivePage(page);
    const begin = (page - 1) * ITEMS_PER_PAGE;
    const end = (page - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE;

    if (type === "artist") setListPerPage(artistList.slice(begin, end));
    if (type === "audio") setListPerPage(audioList.slice(begin, end));
    if (type === "album") setListPerPage(albumList.slice(begin, end));
    if (type === "playlist") setListPerPage(userPlaylist.slice(begin, end));
  };

  return (
    <div className="my-10 px-6 flex flex-col gap-5">
      <p className="text-2xl font-bold">
        {type && capitalizeFirstLetter(type)} Management
      </p>

      <EditArtistModal
        targetArtist={targetArtist}
        openEditArtistModal={openEditArtistModal}
        setOpenEditArtistModal={setOpenEditArtistModal}
      />

      {type && type.toLowerCase() === "artist" && (
        <>
          <table className="mt-10 min-w-full shadow-md border-t border-l border-r border-zinc-500">
            <thead className="p-2 bg-[#2a2a2a]">
              <tr className="bg-[#1a1a1a] text-[#1ed760]">
                {heading.map((h) => {
                  return (
                    <th key={h.key} className="py-3 px-4 text-left">
                      {h.value}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="text-blue-gray-900">
              {listPerPage?.map((artist) => {
                return (
                  <tr
                    key={uuidv4()}
                    className="border-b border-zinc-500 hover:cursor-pointer hover:bg-[#242424]"
                  >
                    <td className="py-3 px-4">
                      <p>{artist.id}</p>
                    </td>
                    <td className="py-3 px-4 max-w-[100px]">
                      <p className="truncate">{artist.name}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p>{artist.followers}</p>
                    </td>
                    <td className="py-3 px-4">
                      <img
                        className="w-[70px] rounded-md"
                        src={artist.avatar}
                        alt="avatar"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-5">
                        <button
                          className="text-black font-bold px-4 py-2 rounded-md bg-[#1ed760] hover:bg-[#19fa6a]"
                          onClick={() => {
                            setOpenEditArtistModal(true);
                            setTargetArtist(artist);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-black font-bold px-4 py-2 rounded-md bg-red-600 hover:bg-red-500"
                          onClick={() => {
                            handleDeleteArtist(artist.id, artist.avatar);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="my-10 flex justify-center items-center">
            <nav aria-label="Page navigation">
              <ul className="inline-flex">
                {pages?.map((page) => {
                  if (page !== activePage) {
                    return (
                      <li key={uuidv4()}>
                        <button
                          className="h-10 px-5 transition-colors duration-150 focus:shadow-outline text-green-600 hover:bg-green-100"
                          onClick={() => {
                            handlePagination(page);
                          }}
                        >
                          {page}
                        </button>
                      </li>
                    );
                  } else {
                    return (
                      <li key={uuidv4()}>
                        <button
                          className="h-10 px-5 transition-colors duration-150 focus:shadow-outline text-white bg-green-600 border border-green-600"
                          onClick={() => {
                            handlePagination(page);
                          }}
                        >
                          {page}
                        </button>
                      </li>
                    );
                  }
                })}
              </ul>
            </nav>
          </div>
        </>
      )}

      {type && type.toLowerCase() === "audio" && (
        <>
          <table className="mt-10 min-w-full shadow-md border-t border-l border-r border-zinc-500">
            <thead className="p-2 bg-[#2a2a2a]">
              <tr className="bg-[#1a1a1a] text-[#1ed760]">
                {heading.map((h) => {
                  return (
                    <th key={h.key} className="py-3 px-4 text-left">
                      {h.value}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="text-blue-gray-900">
              {listPerPage?.map((audio) => {
                return (
                  <tr
                    key={uuidv4()}
                    className="border-b border-zinc-500 hover:cursor-pointer hover:bg-[#242424]"
                  >
                    <td className="py-3 px-4">
                      <p>{audio.id}</p>
                    </td>
                    <td className="py-3 px-4 max-w-[100px]">
                      <p className="truncate">{audio.name}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-3">
                        {audio.artists &&
                          audio.artists?.map((artist: Artist) => {
                            return <p key={uuidv4()}>{artist.name}</p>;
                          })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-3">
                        {audio.albums &&
                          audio.albums?.map((album: Album) => {
                            return <p key={uuidv4()}>{album.name}</p>;
                          })}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-[200px]">
                      <p className="truncate">{audio.url}</p>
                    </td>
                    <td className="py-3 px-4 ">
                      <img
                        className="w-[70px] rounded-md"
                        src={audio.avatar}
                        alt="avatar"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-5">
                        <button className="text-black font-bold px-4 py-2 rounded-md bg-[#1ed760] hover:bg-[#19fa6a]">
                          Edit
                        </button>
                        <button
                          className="text-black font-bold px-4 py-2 rounded-md bg-red-600 hover:bg-red-500"
                          onClick={() => {
                            handleDeleteAudio(audio.id, audio.avatar);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="my-10 flex justify-center items-center">
            <nav aria-label="Page navigation">
              <ul className="inline-flex">
                {pages?.map((page) => {
                  if (page !== activePage) {
                    return (
                      <li key={uuidv4()}>
                        <button
                          className="h-10 px-5 transition-colors duration-150 focus:shadow-outline text-green-600 hover:bg-green-100"
                          onClick={() => {
                            handlePagination(page);
                          }}
                        >
                          {page}
                        </button>
                      </li>
                    );
                  } else {
                    return (
                      <li key={uuidv4()}>
                        <button
                          className="h-10 px-5 transition-colors duration-150 focus:shadow-outline text-white bg-green-600 border border-green-600"
                          onClick={() => {
                            handlePagination(page);
                          }}
                        >
                          {page}
                        </button>
                      </li>
                    );
                  }
                })}
              </ul>
            </nav>
          </div>
        </>
      )}

      {type && type.toLowerCase() === "album" && (
        <>
          <table className="mt-10 min-w-full shadow-md border-t border-l border-r border-zinc-500">
            <thead className="p-2 bg-[#2a2a2a]">
              <tr className="bg-[#1a1a1a] text-[#1ed760]">
                {heading.map((h) => {
                  return (
                    <th key={h.key} className="py-3 px-4 text-left">
                      {h.value}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="text-blue-gray-900">
              {listPerPage?.map((playlist) => {
                return (
                  <tr
                    key={uuidv4()}
                    className="border-b border-zinc-500 hover:cursor-pointer hover:bg-[#242424]"
                  >
                    <td className="py-3 px-4">
                      <p>{playlist.id}</p>
                    </td>
                    <td className="py-3 px-4 max-w-[100px]">
                      <p className="truncate">{playlist.name}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="truncate">{playlist.audios?.length}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="truncate">
                        {playlist.createdAt?.split(" ")[0]}
                      </p>
                    </td>
                    <td className="py-3 px-4 ">
                      <img
                        className="w-[70px] rounded-md"
                        src={playlist.avatar}
                        alt="avatar"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-5">
                        <button
                          className="text-black font-bold px-4 py-2 rounded-md bg-red-600 hover:bg-red-500"
                          onClick={() => {
                            handleDeleteAlbum(playlist.id, playlist.avatar);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="my-10 flex justify-center items-center">
            <nav aria-label="Page navigation">
              <ul className="inline-flex">
                {pages?.map((page) => {
                  if (page !== activePage) {
                    return (
                      <li key={uuidv4()}>
                        <button
                          className="h-10 px-5 transition-colors duration-150 focus:shadow-outline text-green-600 hover:bg-green-100"
                          onClick={() => {
                            handlePagination(page);
                          }}
                        >
                          {page}
                        </button>
                      </li>
                    );
                  } else {
                    return (
                      <li key={uuidv4()}>
                        <button
                          className="h-10 px-5 transition-colors duration-150 focus:shadow-outline text-white bg-green-600 border border-green-600"
                          onClick={() => {
                            handlePagination(page);
                          }}
                        >
                          {page}
                        </button>
                      </li>
                    );
                  }
                })}
              </ul>
            </nav>
          </div>
        </>
      )}

      {type &&
        type.toLowerCase() === "playlist" &&
        userPlaylist.length === 0 && (
          <div className="flex flex-col items-center gap-3 mt-10">
            <p className="text-2xl font-bold">You don't have any playlist</p>
            <div
              className="flex gap-3 items-center hover:cursor-pointer text-zinc-500"
              onClick={() => {
                navigate("/add/playlist");
              }}
            >
              <p className="text-xl">Click to add new</p>
              <MdOutlinePlaylistAddCheck size={40} />
            </div>
          </div>
        )}

      {type &&
        type.toLowerCase() === "playlist" &&
        userPlaylist.length !== 0 && (
          <>
            <table className="mt-10 min-w-full shadow-md border-t border-l border-r border-zinc-500">
              <thead className="p-2 bg-[#2a2a2a]">
                <tr className="bg-[#1a1a1a] text-[#1ed760]">
                  {heading.map((h) => {
                    return (
                      <th key={h.key} className="py-3 px-4 text-left">
                        {h.value}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="text-blue-gray-900">
                {listPerPage?.map((playlist) => {
                  return (
                    <tr
                      key={uuidv4()}
                      className="border-b border-zinc-500 hover:cursor-pointer hover:bg-[#242424]"
                    >
                      <td className="py-3 px-4">
                        <p>{playlist.id}</p>
                      </td>
                      <td className="py-3 px-4 max-w-[100px]">
                        <p className="truncate">{playlist.userId}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="truncate">{playlist.name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="truncate">{playlist.audios?.length}</p>
                      </td>
                      <td className="py-3 px-4 ">
                        <img
                          className="w-[70px] rounded-md"
                          src={playlist.avatar}
                          alt="avatar"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-5">
                          <button
                            className="text-black font-bold px-4 py-2 rounded-md bg-red-600 hover:bg-red-500"
                            onClick={() => {
                              handleDeletePlaylist(playlist.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="my-10 flex justify-center items-center">
              <nav aria-label="Page navigation">
                <ul className="inline-flex">
                  {pages?.map((page) => {
                    if (page !== activePage) {
                      return (
                        <li key={uuidv4()}>
                          <button
                            className="h-10 px-5 transition-colors duration-150 focus:shadow-outline text-green-600 hover:bg-green-100"
                            onClick={() => {
                              handlePagination(page);
                            }}
                          >
                            {page}
                          </button>
                        </li>
                      );
                    } else {
                      return (
                        <li key={uuidv4()}>
                          <button
                            className="h-10 px-5 transition-colors duration-150 focus:shadow-outline text-white bg-green-600 border border-green-600"
                            onClick={() => {
                              handlePagination(page);
                            }}
                          >
                            {page}
                          </button>
                        </li>
                      );
                    }
                  })}
                </ul>
              </nav>
            </div>
          </>
        )}
    </div>
  );
};

export default Management;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { RootState } from "../redux/store";

import {
  getAllArtists,
  deleteArtistById,
  deleteAudioById,
  getAllAudios,
} from "../redux/reducers/media.reducer";

import { Artist, Audio } from "../types/media";

const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const Management = () => {
  const params = useParams();
  const { type } = params;

  const [heading, setHeading] = useState<{ key: string; value: string }[]>([]);

  const dispatchAsync = useAppDispatch();

  const artistList = useSelector<RootState, Artist[]>(
    (state) => state.media.artists
  );

  const audioList = useSelector<RootState, Audio[]>(
    (state) => state.media.audios
  );

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

  const handleDeleteArtist = (id: number | undefined) => {
    if (confirm(`Are you sure want to delete artist ${id}?`) == true) {
      if (id !== undefined) {
        const promise = dispatchAsync(deleteArtistById(id));

        promise.then((res) => {
          if (res.type === "artists/deleteArtistById/fulfilled") {
            toast.success("Delete artist successfully");
            dispatchAsync(getAllArtists());
          }

          if (res.type === "artists/deleteArtistById/rejected") {
            toast.error("Delete artist failed");
          }
        });
      }
    } else {
      //
    }
  };

  const handleDeleteAudio = (id: number | undefined) => {
    if (confirm(`Are you sure want to delete audio ${id}?`) == true) {
      if (id !== undefined) {
        const promise = dispatchAsync(deleteAudioById(id));

        promise.then((res) => {
          if (res.type === "audios/deleteAudioById/fulfilled") {
            toast.success("Delete audio successfully");
            dispatchAsync(getAllAudios());
          }

          if (res.type === "audios/deleteAudioById/rejected") {
            toast.error("Delete audio failed");
          }
        });
      }
    } else {
      //
    }
  };

  return (
    <div className="my-10 px-6 flex flex-col gap-5">
      <p className="text-2xl font-bold">
        {type && capitalizeFirstLetter(type)} Management
      </p>

      {type && type.toLowerCase() === "artist" && (
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
            {artistList.map((artist) => {
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
                      className="w-[80px]"
                      src={artist.avatar}
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
                          handleDeleteArtist(artist.id);
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
      )}

      {type && type.toLowerCase() === "audio" && (
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
            {audioList.map((audio) => {
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
                        audio.artists?.map((artist) => {
                          return <p key={uuidv4()}>{artist.name}</p>;
                        })}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-3">
                      {audio.albums &&
                        audio.albums?.map((album) => {
                          return <p key={uuidv4()}>{album.name}</p>;
                        })}
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-[200px]">
                    <p className="truncate">{audio.url}</p>
                  </td>
                  <td className="py-3 px-4 ">
                    <img className="w-[80px]" src={audio.avatar} alt="avatar" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-5">
                      <button className="text-black font-bold px-4 py-2 rounded-md bg-[#1ed760] hover:bg-[#19fa6a]">
                        Edit
                      </button>
                      <button
                        className="text-black font-bold px-4 py-2 rounded-md bg-red-600 hover:bg-red-500"
                        onClick={() => {
                          handleDeleteAudio(audio.id);
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
      )}
    </div>
  );
};

export default Management;

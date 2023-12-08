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
} from "../redux/reducers/media.reducer";

import { Artist } from "../types/media";

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

  return (
    <div className="mt-10 px-6 flex flex-col gap-5">
      <p className="text-2xl font-bold">
        {type && capitalizeFirstLetter(type)} Management
      </p>

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
          {type &&
            type?.toLowerCase() === "artist" &&
            artistList.map((artist) => {
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
                  <td className="py-3 px-4 max-w-[200px]">
                    <p className="truncate">{artist.avatar}</p>
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
    </div>
  );
};

export default Management;

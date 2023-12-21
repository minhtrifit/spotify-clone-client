import { createReducer, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import {
  PendingAction,
  FulfilledAction,
  RejectedAction,
} from "../../types/reduxthunk.type";

import {
  updateTargetAudio,
  updateIsPlaying,
  updateIsPlayingAlbum,
  updateTargetAlbum,
  updateAlbums,
} from "../actions/media.action";

import { Audio, Album, Artist, Playlist } from "../../types/media";
import { AudioColumnType } from "../../types/playlist";

// Interface declair
interface MediaState {
  currentId: string;
  isLoading: boolean;
  isError: boolean;
  audios: Audio[];
  targetAudio: Audio | null;
  detailAudio: Audio | null;
  isPlayingAudio: boolean;
  albums: Album[];
  targetAlbum: Album | null;
  detailAlbum: Album | null;
  isPlayingAlbum: boolean;
  artists: Artist[];
  targetArtist: Artist | null;
  audiosColumn: AudioColumnType[];
  userPlaylist: Playlist[];
}

// createAsyncThunk middleware
export const getAllAudios = createAsyncThunk(
  "audios/getAllAudios",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // Dùng dấu _ cho các API không có params
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<Audio[]>(
        `${import.meta.env.VITE_API_URL}/api/v1/audios`,
        {
          signal: thunkAPI.signal,
        }
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AxiosError") {
        return thunkAPI.rejectWithValue({ message: "Get audios failed" });
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllAudiosColumn = createAsyncThunk(
  "audios/getAllAudiosColumn",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // Dùng dấu _ cho các API không có params
  async (columnId: string, thunkAPI) => {
    try {
      const response = await axios.get<any>(
        `${import.meta.env.VITE_API_URL}/api/v1/audios`,
        {
          signal: thunkAPI.signal,
        }
      );

      const source: any = response.data.data;

      const data = source.map((audio: Audio) => {
        return { ...audio, columnId: columnId };
      });

      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AxiosError") {
        return thunkAPI.rejectWithValue({ message: "Get audios failed" });
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAudioById = createAsyncThunk(
  "audios/getAudioById",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (id: number, thunkAPI) => {
    try {
      const response = await axios.get<Audio[]>(
        `${import.meta.env.VITE_API_URL}/api/v1/audio/${id}`,
        {
          signal: thunkAPI.signal,
        }
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AxiosError") {
        return thunkAPI.rejectWithValue({ message: "Get audio failed" });
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllAlbums = createAsyncThunk(
  "albums/getAllAlbums",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // Dùng dấu _ cho các API không có params
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<Album[]>(
        `${import.meta.env.VITE_API_URL}/api/v1/albums`,
        {
          signal: thunkAPI.signal,
        }
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AxiosError") {
        return thunkAPI.rejectWithValue({ message: "Get albums failed" });
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAlbumById = createAsyncThunk(
  "albums/getAlbumById",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (id: number, thunkAPI) => {
    try {
      const response = await axios.get<Album[]>(
        `${import.meta.env.VITE_API_URL}/api/v1/album/${id}`,
        {
          signal: thunkAPI.signal,
        }
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AxiosError") {
        return thunkAPI.rejectWithValue({ message: "Get album failed" });
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addNewArtist = createAsyncThunk(
  "artists/addNewArtist",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (artist: Artist, thunkAPI) => {
    try {
      const accessToken = sessionStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      if (accessToken) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/add/artist`,
          {
            name: artist.name,
            avatar: artist.avatar,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        return response.data;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteArtistById = createAsyncThunk(
  "artists/deleteArtistById",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (id: number, thunkAPI) => {
    try {
      const accessToken = sessionStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      if (accessToken) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/delete/artist/${id}`,
          {
            //
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        return response.data;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllArtists = createAsyncThunk(
  "artists/getAllArtists",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (_, thunkAPI) => {
    try {
      const response = await axios.get<Artist[]>(
        `${import.meta.env.VITE_API_URL}/api/v1/artists`,
        {
          signal: thunkAPI.signal,
        }
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AxiosError") {
        return thunkAPI.rejectWithValue({ message: "Get artists failed" });
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getArtistById = createAsyncThunk(
  "artists/getArtistById",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (id: number, thunkAPI) => {
    try {
      const response = await axios.get<Artist[]>(
        `${import.meta.env.VITE_API_URL}/api/v1/artist/${id}`,
        {
          signal: thunkAPI.signal,
        }
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AxiosError") {
        return thunkAPI.rejectWithValue({ message: "Get artists failed" });
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const editArtist = createAsyncThunk(
  "artists/EditArtist",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (editArtist: Artist, thunkAPI) => {
    try {
      const accessToken = sessionStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      if (accessToken) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/edit/artist`,
          {
            id: editArtist.id,
            name: editArtist.name,
            followers: editArtist.followers,
            avatar: editArtist.avatar,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        return response.data;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addNewAudio = createAsyncThunk(
  "audios/addNewAudio",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (audio: Audio, thunkAPI) => {
    try {
      const accessToken = sessionStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      if (accessToken) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/add/audio`,
          {
            name: audio.name,
            artists: audio.artists,
            albums: audio.albums,
            url: audio.url,
            avatar: audio.avatar,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        return response.data;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteAudioById = createAsyncThunk(
  "audios/deleteAudioById",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (id: number, thunkAPI) => {
    try {
      const accessToken = sessionStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      if (accessToken) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/delete/audio/${id}`,
          {
            //
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        return response.data;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addNewPlaylist = createAsyncThunk(
  "playlists/addNewPlaylist",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (playlist: Playlist, thunkAPI) => {
    try {
      const accessToken = sessionStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      if (accessToken) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/add/playlist`,
          {
            userId: playlist.userId,
            name: playlist.name,
            audios: playlist.audios,
            avatar: playlist.avatar,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        return response.data;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllPlaylistsByUserId = createAsyncThunk(
  "playlists/getAllPlaylistsByUserId",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (userId: number, thunkAPI) => {
    try {
      const response = await axios.get<Playlist[]>(
        `${import.meta.env.VITE_API_URL}/api/v1/playlist/${userId}`,
        {
          signal: thunkAPI.signal,
        }
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AxiosError") {
        return thunkAPI.rejectWithValue({ message: "Get audios failed" });
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getPlaylistById = createAsyncThunk(
  "playlists/getPlaylistById",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (playlistId: number, thunkAPI) => {
    try {
      const response = await axios.get<Playlist>(
        `${import.meta.env.VITE_API_URL}/api/v1/playlist/detail/${playlistId}`,
        {
          signal: thunkAPI.signal,
        }
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AxiosError") {
        return thunkAPI.rejectWithValue({ message: "Get audios failed" });
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const modifyAddPlaylist = createAsyncThunk(
  "playlists/modifyAddPlaylist",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (
    data: { userId: number; playlistId: number; audioId: number },
    thunkAPI
  ) => {
    try {
      const accessToken = sessionStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      if (accessToken) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/v1/edit/playlist`,
          {
            userId: data.userId,
            playlistId: data.playlistId,
            audioId: data.audioId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        return response.data;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const modifyDeletePlaylist = createAsyncThunk(
  "playlists/modifyDeletePlaylist",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (
    data: { userId: number; playlistId: number; audioId: number },
    thunkAPI
  ) => {
    try {
      const accessToken = sessionStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      if (accessToken) {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/v1/edit/playlist`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            data: {
              userId: data.userId,
              playlistId: data.playlistId,
              audioId: data.audioId,
            },
          }
        );

        return response.data;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deletePlaylistById = createAsyncThunk(
  "playlists/deletePlaylistById",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (id: number, thunkAPI) => {
    try {
      const accessToken = sessionStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      if (accessToken) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/delete/playlist/${id}`,
          {
            //
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        return response.data;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteAlbumById = createAsyncThunk(
  "albums/deleteAlbumById",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (id: number, thunkAPI) => {
    try {
      const accessToken = sessionStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      if (accessToken) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/delete/album/${id}`,
          {
            //
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        return response.data;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addNewAlbum = createAsyncThunk(
  "albums/addNewAlbum",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (album: Album, thunkAPI) => {
    try {
      const accessToken = sessionStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      if (accessToken) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/add/album`,
          {
            name: album.name,
            audios: album.audios,
            avatar: album.avatar,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        return response.data;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// InitialState value
const initialState: MediaState = {
  currentId: "",
  isLoading: false,
  isError: false,
  audios: [],
  targetAudio: null,
  detailAudio: null,
  isPlayingAudio: false,
  albums: [],
  detailAlbum: null,
  isPlayingAlbum: false,
  targetAlbum: null,
  artists: [],
  targetArtist: null,
  audiosColumn: [],
  userPlaylist: [],
};

const mediaReducer = createReducer(initialState, (builder) => {
  builder

    .addCase(getAllAudios.fulfilled, (state, action) => {
      const payload: any = action.payload;
      state.audios = payload.data;
    })

    .addCase(getAllAudiosColumn.fulfilled, (state, action) => {
      const payload: any = action.payload;
      state.audiosColumn = payload;
    })

    .addCase(updateTargetAudio, (state, action) => {
      const audio: any = action.payload;
      state.targetAudio = audio;
      state.isPlayingAudio = true;
    })

    .addCase(updateTargetAlbum, (state, action) => {
      const album: any = action.payload;
      state.targetAlbum = album;
    })

    .addCase(updateAlbums, (state, action) => {
      const value: any = action.payload;
      state.albums = value;
    })

    .addCase(getAudioById.fulfilled, (state, action) => {
      const payload: any = action.payload;
      state.detailAudio = payload.data;
    })

    .addCase(updateIsPlaying, (state, action) => {
      const value: any = action.payload;
      state.isPlayingAudio = value;
    })

    .addCase(getAllAlbums.fulfilled, (state, action) => {
      const payload: any = action.payload;
      state.albums = payload.data;
    })

    .addCase(getAlbumById.fulfilled, (state, action) => {
      const payload: any = action.payload;
      state.detailAlbum = payload.data;
    })

    .addCase(updateIsPlayingAlbum, (state, action) => {
      const value: any = action.payload;
      state.isPlayingAlbum = value;
    })

    .addCase(getAllArtists.fulfilled, (state, action) => {
      const payload: any = action.payload;
      state.artists = payload.data;
    })

    .addCase(getArtistById.fulfilled, (state, action) => {
      const payload: any = action.payload;
      state.targetArtist = payload.data;
    })

    .addCase(getAllPlaylistsByUserId.fulfilled, (state, action) => {
      const payload: any = action.payload;
      state.userPlaylist = payload.data;
    })

    .addCase(getPlaylistById.fulfilled, (state, action) => {
      const payload: any = action.payload;
      state.detailAlbum = payload.data;
    })

    .addMatcher(
      (action): action is PendingAction => action.type.endsWith("/pending"),
      (state, action) => {
        state.currentId = action.meta.requestId;
        if (state.currentId === action.meta.requestId) {
          state.isLoading = true;
        }
      }
    )
    .addMatcher(
      (action): action is FulfilledAction => action.type.endsWith("/fulfilled"),
      (state, action) => {
        if (state.isLoading && state.currentId === action.meta.requestId) {
          state.isLoading = false;
          state.isError = false;
        }
      }
    )
    .addMatcher(
      (action): action is RejectedAction => action.type.endsWith("/rejected"),
      (state, action) => {
        if (state.isLoading && state.currentId === action.meta.requestId) {
          state.isLoading = false;
          state.isError = true;
        }
      }
    );
});

export default mediaReducer;

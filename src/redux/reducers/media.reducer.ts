import { createReducer, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import {
  updateTargetAudio,
  updateIsPlaying,
  updateIsPlayingAlbum,
  updateTargetAlbum,
} from "../actions/media.action";

import { Audio, Album, Artist } from "../../types/media";

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
};

const mediaReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(getAllAudios.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllAudios.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;

      const payload: any = action.payload;
      state.audios = payload.data;
    })
    .addCase(getAllAudios.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
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

    .addCase(getAudioById.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAudioById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;

      const payload: any = action.payload;
      state.detailAudio = payload.data;
    })
    .addCase(getAudioById.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    })

    .addCase(updateIsPlaying, (state, action) => {
      const value: any = action.payload;
      state.isPlayingAudio = value;
    })

    .addCase(getAllAlbums.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllAlbums.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;

      const payload: any = action.payload;
      state.albums = payload.data;
    })
    .addCase(getAllAlbums.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    })

    .addCase(getAlbumById.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAlbumById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;

      const payload: any = action.payload;
      state.detailAlbum = payload.data;
    })
    .addCase(getAlbumById.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    })

    .addCase(updateIsPlayingAlbum, (state, action) => {
      const value: any = action.payload;
      state.isPlayingAlbum = value;
    })

    .addCase(getAllArtists.fulfilled, (state, action) => {
      const payload: any = action.payload;
      state.artists = payload.data;
    });
});

export default mediaReducer;

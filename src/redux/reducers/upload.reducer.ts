import { createReducer, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { updateImageUrl, updateAudioUrl } from "../actions/upload.action";

// Interface declair
interface UserState {
  imageUrl: string;
  audioUrl: string;
}

export const uploadImage = createAsyncThunk(
  "uploads/uploadImage",

  async (formData: FormData, thunkAPI) => {
    try {
      //   const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
      //     method: "POST",
      //     body: formData,
      //   }).then((res) => res.json());

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AxiosError") {
        return thunkAPI.rejectWithValue({ message: "Upload image failed" });
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteFileByName = createAsyncThunk(
  "uploads/uploadImage",

  async (fileName: string, thunkAPI) => {
    try {
      const response = await axios.delete(`${fileName}`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AxiosError") {
        return thunkAPI.rejectWithValue({ message: "Delete file failed" });
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const uploadAudio = createAsyncThunk(
  "uploads/uploadAudio",

  async (formData: FormData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_UPLOAD_AUDIO_API_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AxiosError") {
        return thunkAPI.rejectWithValue({ message: "Upload audio failed" });
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// InitialState value
const initialState: UserState = {
  imageUrl: "",
  audioUrl: "",
};

const uploadReducer = createReducer(initialState, (builder) => {
  builder

    .addCase(uploadImage.fulfilled, (state, action) => {
      state.imageUrl = action.payload.data;
    })

    .addCase(updateImageUrl, (state, action) => {
      state.imageUrl = action.payload;
    })

    .addCase(uploadAudio.fulfilled, (state, action) => {
      state.audioUrl = action.payload;
    })

    .addCase(updateAudioUrl, (state, action) => {
      state.audioUrl = action.payload;
    });
});

export default uploadReducer;

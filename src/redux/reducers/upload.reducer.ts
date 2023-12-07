import { createReducer, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { updateImageUrl } from "../actions/upload.action";

// Interface declair
interface UserState {
  imageUrl: string;
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

// InitialState value
const initialState: UserState = {
  imageUrl: "",
};

const uploadReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(uploadImage.fulfilled, (state, action) => {
      if (action.payload) {
        state.imageUrl = action.payload.data;
      }
    })

    .addCase(updateImageUrl, (state, action) => {
      state.imageUrl = action.payload;
    });
});

export default uploadReducer;

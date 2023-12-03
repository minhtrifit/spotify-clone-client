import { createReducer, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { updateTargetAudio } from "../actions/media.action";

import { Audio } from "../../types/media";

// Interface declair
interface MediaState {
  currentId: string;
  isLoading: boolean;
  isError: boolean;
  audios: Audio[];
  targetAudio: Audio | null;
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

// export const addNewProduct = createAsyncThunk(
//   "products/addNewProduct",
//   async (product: NewProduct, thunkAPI) => {
//     try {
//       const response = await axios.post<{ id: string }>(
//         `${import.meta.env.VITE_API_URL}/products`,
//         {
//           signal: thunkAPI.signal,
//           body: JSON.stringify(product),
//         }
//       );

//       const newProductId = response.data?.id;

//       // Create Product
//       const data: Product = {
//         ...product,
//         id: Number(newProductId),
//         price: product.price.toString(),
//       };

//       return data;
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       if (error.name === "AxiosError") {
//         return thunkAPI.rejectWithValue({ message: "Add products failed" });
//       }
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

// InitialState value
const initialState: MediaState = {
  currentId: "",
  isLoading: false,
  isError: false,
  audios: [],
  targetAudio: null,
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
    });
});

export default mediaReducer;

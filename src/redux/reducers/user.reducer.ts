import { createReducer, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../types/user";

// Interface declair
interface UserState {
  profile: User | null;
  accessToken: string;
  refreshToken: string;
  isLoading: boolean;
}

export const loginAccount = createAsyncThunk(
  "users/loginAccount",

  async (account: { username: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          signal: thunkAPI.signal,
          username: account.username,
          password: account.password,
        }
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AxiosError") {
        return thunkAPI.rejectWithValue({ message: "Add products failed" });
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "users/getUserProfile",

  async (_, thunkAPI) => {
    try {
      const accessToken = sessionStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      if (accessToken) {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/profile`,
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

export const handleAccessToken = createAsyncThunk(
  "users/handleAccessToken",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (_, thunkAPI) => {
    try {
      const accessToken = sessionStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      if (accessToken) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/verify`,
          {
            // data
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
const initialState: UserState = {
  profile: null,
  accessToken: "",
  refreshToken: "",
  isLoading: false,
};

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loginAccount.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(loginAccount.fulfilled, (state, action) => {
      if (action.payload) {
        const data: { accessToken: string; refreshToken: string } =
          action.payload.data;

        state.accessToken = data.accessToken;
        state.refreshToken = data.refreshToken;

        sessionStorage.setItem("accessToken", JSON.stringify(data.accessToken));
        sessionStorage.setItem(
          "refreshToken",
          JSON.stringify(data.refreshToken)
        );
      }
      state.isLoading = false;
    })
    .addCase(loginAccount.rejected, (state) => {
      state.isLoading = false;
    })

    .addCase(getUserProfile.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getUserProfile.fulfilled, (state, action) => {
      if (action.payload) {
        const userData: User = action.payload.data;
        state.profile = userData;
      }
      state.isLoading = false;
    })
    .addCase(getUserProfile.rejected, (state) => {
      state.isLoading = false;
    })

    .addCase(handleAccessToken.fulfilled, (state, action) => {
      if (action.payload) {
        const data: User = action.payload.data;

        state.profile = data;
      }
    });
});

export default userReducer;

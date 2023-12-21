import { createReducer, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import {
  PendingAction,
  FulfilledAction,
  RejectedAction,
} from "../../types/reduxthunk.type";

import { User } from "../../types/user";

import { logoutAccount } from "../actions/user.action";

// Interface declair
interface UserState {
  currentId: string;
  profile: User | null;
  accessToken: string;
  refreshToken: string;
  isLoading: boolean;
  isError: boolean;
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
        return thunkAPI.rejectWithValue({ message: "Login account failed" });
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const registerAccount = createAsyncThunk(
  "users/registerAccount",

  async (account: User, thunkAPI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          signal: thunkAPI.signal,
          username: account.username,
          password: account.password,
          email: account.email,
          roles: account.roles,
        }
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AxiosError") {
        return thunkAPI.rejectWithValue({ message: "Register account failed" });
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
  currentId: "",
  profile: null,
  accessToken: "",
  refreshToken: "",
  isLoading: false,
  isError: false,
};

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loginAccount.fulfilled, (state, action) => {
      const data: { accessToken: string; refreshToken: string } =
        action.payload.data;

      state.accessToken = data.accessToken;
      state.refreshToken = data.refreshToken;

      sessionStorage.setItem("accessToken", JSON.stringify(data.accessToken));
      sessionStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
    })

    .addCase(getUserProfile.fulfilled, (state, action) => {
      const userData: User = action.payload.data;
      state.profile = userData;
    })

    .addCase(handleAccessToken.fulfilled, (state, action) => {
      const data: User = action.payload?.data;

      const accessToken = sessionStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      const refreshToken = sessionStorage
        .getItem("refreshToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      if (data && accessToken && refreshToken) {
        state.profile = data;

        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
      }
    })

    .addCase(logoutAccount, (state) => {
      state.profile = null;
      state.accessToken = "";
      state.refreshToken = "";
      sessionStorage.clear();
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

export default userReducer;

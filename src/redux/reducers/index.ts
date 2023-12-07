import { combineReducers } from "@reduxjs/toolkit";
import mediaReducer from "./media.reducer";
import userReducer from "./user.reducer";
import uploadReducer from "./upload.reducer";

export const rootReducer = combineReducers({
  media: mediaReducer,
  user: userReducer,
  upload: uploadReducer,
});

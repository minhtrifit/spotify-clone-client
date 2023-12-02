import { combineReducers } from "@reduxjs/toolkit";
import mediaReducer from "./media.reducer";

export const rootReducer = combineReducers({
  media: mediaReducer,
});

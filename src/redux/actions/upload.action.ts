import { createAction } from "@reduxjs/toolkit";

export const updateImageUrl = createAction<string>("upload/updateImageUrl");
export const updateAudioUrl = createAction<string>("upload/updateAudioUrl");

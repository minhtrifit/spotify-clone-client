import { createAction } from "@reduxjs/toolkit";

export const updateTargetAudio = createAction<string>(
  "media/updateTargetAudio"
);

export const updateIsPlaying = createAction<string>("media/updateIsPlaying");

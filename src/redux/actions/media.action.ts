import { createAction } from "@reduxjs/toolkit";

export const updateTargetAudio = createAction<string>(
  "media/updateTargetAudio"
);

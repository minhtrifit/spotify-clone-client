import { createAction } from "@reduxjs/toolkit";

export const updateTargetAudio = createAction<string>(
  "media/updateTargetAudio"
);

export const updateIsPlaying = createAction<string>("media/updateIsPlaying");

export const updateTargetAlbum = createAction<string>(
  "media/updateTargetAlbum"
);

export const updateIsPlayingAlbum = createAction<string>(
  "media/updateIsPlayingAlbum"
);

export const updateAlbums = createAction<string>("media/updateAlbums");

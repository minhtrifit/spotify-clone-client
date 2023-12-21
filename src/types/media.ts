export interface Audio {
  id?: number;
  name: string;
  artists?: Artist[];
  albums?: Album[];
  url?: string;
  avatar?: string;
}

export interface Artist {
  id?: number;
  name: string;
  followers?: number;
  avatar?: string;
}

export interface Album {
  id?: number;
  name: string;
  author?: string;
  audios?: Audio[];
  createdAt?: string;
  avatar?: string;
}

export interface Playlist {
  id?: number;
  userId?: number;
  name: string;
  audios?: Audio[] | (number | undefined)[];
  avatar?: string;
}

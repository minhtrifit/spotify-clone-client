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
  id: number;
  name: string;
  audios?: Audio[];
  createdAt?: string;
  avatar?: string;
}

export interface Audio {
  id: number;
  name: string;
  artists?: Artist[];
  albums?: Album[];
  url?: string;
}

interface Artist {
  id: number;
  name: string;
  followers?: number;
  avatar?: number;
}

interface Album {
  id: number;
  name: string;
  audios?: Audio[];
  createdAt?: string;
}

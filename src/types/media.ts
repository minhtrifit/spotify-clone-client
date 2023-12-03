export interface Audio {
  id: number;
  name: string;
  artists?: Artist[];
  albums?: Album[];
  url?: string;
  avatar?: string;
}

interface Artist {
  id: number;
  name: string;
  followers?: number;
  avatar?: string;
}

interface Album {
  id: number;
  name: string;
  audios?: Audio[];
  createdAt?: string;
  avatar?: string;
}

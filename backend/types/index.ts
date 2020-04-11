export type Score = {
  link: string;
  title: string;
  source: string;
};

export type AudioWithAlbum = {
  uid: string;
  audio_link: string;
  album_link: string;
  url: string;
  player: string;
  album_name: string;
  song_name: string;
  album_sd: string;
  album_hd: string;
  source: string;
};

export type Video = {
  link: string;
  thumbnail: string;
  title: string;
  id: string;
};

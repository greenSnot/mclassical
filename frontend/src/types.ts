export enum Tab {
  audio = 'audio',
  video = 'video',
  score = 'score',
}

export type Video = {
  link: string;
  thumbnail: string;
  title: string;
  source: string;
  id: string;
};

export type Score = {
  id: number;
  link: string;
  title: string;
  source: string;
};

export type Audio = {
  id: number;
  uid: string;
  reference_url: string;
  player: string;
  album_name: string;
  name: string;
  album_sd: string;
  album_hd: string;
  source: string;
};

export type SearchType = 'score' | 'video' | 'audio';
export type Result = {
  code: number;
  type: SearchType;
  videos: Video[];
  audios: Audio[];
  scores: Score[];
};
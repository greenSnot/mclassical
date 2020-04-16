export type Score = {
  id: number;
  link: string;
  title: string;
  source: string;
  relevance?: number;
};

export type Video = {
  link: string;
  thumbnail: string;
  title: string;
	source: string;
  id: string;
};

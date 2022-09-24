import { Audio } from "./types";

const names = [
  'Violin Sonata No.5, Op.24 - Allegro (F major) (F大调第5号小提琴与钢琴奏鸣曲，作品24“春天”)',
  'フタツノヤソウキョク サクヒンニジュウナナ - No. 2 in D flat major. Lento sostenuto',
  'Goldberg Variations, BWV 988 - Aria',
  `12 Études, Op. 10 - Etude in C minor 'Revolutionary' (12首练习曲，作品10)`,
  'Symphony No. 5 in C Minor, Op. 67 - I. Allegro con brio (C Minor) (C小调第5号交响曲，作品67)',
];

const album_names = [
  'Beethoven: The Complete Violin Sonatas',
  'Chopin: Nocturnes',
  '哥德堡变奏曲',
  'Chopin: Etudes Opp.10 & 25',
  'Beethoven: Symphonies Nos.5 & 7',
];

const player_names = [
  'Itzhak Perlman /Vladimir Ashkenazy',
  '郎朗',
  'Maurizio Pollini',
  'Wiener Philharmoniker /Carlos Kleiber',
];

export function random_audios(): Audio[] {
  return new Array(100).fill(0).map((i) => {
    const idx = Math.ceil(Math.random() * 70);
    return {
      id: Math.random(),
      uid: Math.random().toString(),
      reference_url: '',
      player: player_names[Math.floor(Math.random() * player_names.length)],
      album_name: album_names[Math.floor(Math.random() * album_names.length)],
      name: names[Math.floor(Math.random() * names.length)],
      album_sd: `./mock/test${idx}.jpg`,
      album_hd: `./mock/test${idx}.jpg`,
      source: '',
    };
  });
}
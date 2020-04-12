import * as request from 'request';
import { request_get, request_post, unicode_to_chr } from '../utils';
import config from '../config';
import { Score, AudioWithAlbum, Video } from '../types';
import * as Model from '../model/audio_with_album';
import { getConnection } from '../db';

export default {
  random_audios: async function(n: number): Promise<AudioWithAlbum[]> {
    const connection = await getConnection();
    const repository = connection.getRepository(Model.AudioWithAlbum);
    const res = await repository.findOne(1);
    console.log(res);
    return [];
  },

  search_audios: async function(keyword: string, page: number): Promise<AudioWithAlbum[]> {
    /*
    data.push({
      song_id: t._source.other_id.qqmusic_song_id,
      id: 'qqmusic_' + t._source.other_id.qqmusic_song_id,
      song_link: 'http://y.qq.com/#type=song&mid=' + t._source.other_id.qqmusic_song_mid,
      album_link: 'http://y.qq.com/#type=album&mid=' + t._source.other_id.qqmusic_album_mid,
      url: t._source.resources[0].url,
      player: t._source.players[0].name.en || t._source.players[0].name.cn,
      album_name: t._source.album_name.en || t._source.album_name.cn,
      song_name: t._source.name.en || t._source.name.cn,
      album_small: t._source.album_image,
      album_big: t._source.album_image,
      source: 'QQMusic',
    });
     */
    return [];
  },

  search_videos: async function(keyword: string, page: number) {
    const url = `${config.youku.search_url}?client_id=${config.youku.client_id}&keyword=${encodeURIComponent(keyword)}`;
    const videos = (JSON.parse(unicode_to_chr(await request_get(url))) as {
      videos: Video[];
    }).videos;
    return videos.map(i => ({
      link: i.link,
      id: i.id,
      thumbnail: i.thumbnail,
      title: i.title,
      source: 'Youku',
    }));
  },

  search_scores_imslp: async function(keyword: string): Promise<Score[]> {
    const url = `${config.google.imslp_search_url}q=${encodeURIComponent(keyword)}&cx=${config.google.search_engine_id}&key=${config.google.api_key}&fields=items(title,link)`;
    const result = JSON.parse(await request_get(url)) as {
      error: string;
      items: {
        title: string;
        link: string;
      }[];
    };
    if (result.error) {
      return [];
    }
    return result.items.map(i => ({
      title: i.title.indexOf(' - IMSLP') ? i.title.substring(0, i.title.indexOf(' - IMSLP')) : i.title,
      link: i.link,
      source: 'IMSLP',
    } as Score));
  },

  search_scores_db: function(keyword: string, page: number): Score[] {
    /*
    const id = t.resources[j].url.match(/(\w)+\.pdf$/)[0].split('.pdf')[0];
    data.push({
      source: 'Musopen',
      title: t.name + ' ' + t.resources[j].name,
      link: config.domain + '/pdf/' + id,
    });
    */
    return [] as Score[];
  },

  pdf_proxy: function(id: string, res: any) {
    request.get('https://app.box.com/shared/static/' + id + '.pdf').pipe(res);
  },
};

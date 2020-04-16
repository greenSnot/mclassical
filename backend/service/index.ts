import * as request from 'request';
import { request_get, request_post, unicode_to_chr } from '../utils';
import config from '../config';
import { Score, Video } from '../types';
import { AudioWithAlbum } from '../model/audio_with_album';
import { ScoreName } from '../model/score_name';
import { getConnection } from '../db';

export default {
  random_audios: async function(n: number): Promise<AudioWithAlbum[]> {
    const connection = await getConnection();
    const limit = 90;
    let result: AudioWithAlbum[] = [];
    while (result.length < limit) {
      const x = `*${Math.random()
        .toString(16)
        .substr(3, 2)}*`;
      result = result.concat(
        await connection.manager
          .getRepository(AudioWithAlbum)
          .createQueryBuilder()
          .select()
          .where(
            'match (player, `name`, album_name) AGAINST (:searchTerm in boolean mode)',
            { searchTerm: x }
          )
          .limit(limit)
          .getMany()
      );
    }
    return result.splice(0, limit);
  },

  search_audios: async function(
    keyword: string,
    page: number
  ): Promise<AudioWithAlbum[]> {
    const connection = await getConnection();
    const limit = 10;
    page = Math.max(1, page);
    const result = await connection.manager
      .getRepository(AudioWithAlbum)
      .createQueryBuilder()
      .select()
      .where(
        'match (player, `name`, album_name) AGAINST (:searchTerm in natural language mode)',
        { searchTerm: keyword }
      )
      .limit(limit)
      .skip(limit * (page - 1))
      .getMany();
    return result;
  },

  search_videos: async function(keyword: string, page: number) {
    const url = `${config.youku.search_url}?client_id=${
      config.youku.client_id
    }&keyword=${encodeURIComponent(keyword)}`;
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
    const url = `${config.google.imslp_search_url}q=${encodeURIComponent(
      keyword
    )}&cx=${config.google.search_engine_id}&key=${
      config.google.api_key
    }&fields=items(title,link)`;
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
    return result.items.map(
      i =>
        ({
          title: i.title.indexOf(' - IMSLP')
            ? i.title.substring(0, i.title.indexOf(' - IMSLP'))
            : i.title,
          link: i.link,
          source: 'IMSLP',
        } as Score)
    );
  },

  search_scores_db: async function(
    keyword: string,
    page: number
  ): Promise<Score[]> {
    const connection = await getConnection();
    const limit = 10;
    page = Math.max(1, page);
    const result: any[] = await connection.manager.query(
      `
SELECT distinct score_name.scoreId, score.pdf_complete, score_name.name as score_name, score_composer.name as composer_name,
MATCH (score_name.name)
    AGAINST (? in natural language mode) as relevance
FROM score_name
    LEFT JOIN score ON score_name.scoreId = score.id
    LEFT JOIN score_composer ON score_name.scoreId = score_composer.scoreId
    WHERE MATCH (score_name.name)
    AGAINST (? in natural language mode)
UNION ALL
SELECT distinct score_pdf_part.scoreId, score.pdf_complete, score_name.name as score_name, score_composer.name as composer_name,
MATCH (score_pdf_part.name)
    AGAINST (? in natural language mode) as relevance
FROM score_pdf_part
    LEFT JOIN score ON score_pdf_part.scoreId = score.id
    LEFT JOIN score_name ON score_pdf_part.scoreId = score_name.scoreId
    LEFT JOIN score_composer ON score_pdf_part.scoreId = score_composer.scoreId
    WHERE MATCH (score_pdf_part.name)
    AGAINST (? in natural language mode)
UNION ALL
SELECT distinct score_composer.scoreId, score.pdf_complete, score_name.name as score_name, score_composer.name as composer_name,
MATCH (score_composer.name)
    AGAINST (? in natural language mode) as relevance
FROM score_composer
    RIGHT JOIN score ON score_composer.scoreId = score.id
    RIGHT JOIN score_name ON score_composer.scoreId = score_name.scoreId
    WHERE MATCH (score_composer.name)
    AGAINST (? in natural language mode)
    ORDER BY relevance DESC limit ? offset ?;
      `,
      [
        keyword,
        keyword,
        keyword,
        keyword,
        keyword,
        keyword,
        limit,
        limit * (page - 1),
      ]
    );

    function to_proxy(s: string = '') {
      if (!s) {
        return s;
      }
      const m = s.match(/(\w)+\.pdf$/);
      const id = m ? m[0].split('.pdf')[0] : '';
      return `${config.backend_domain}:${config.backend_port}/pdf/${id}`;
    }

    const ids: {
      [key: string]: boolean;
    } = {};
    return result
      .sort((a, b) => b.relevance! - a.relevance!)
      .map(i => {
        if (ids[i.scoreId]) return null;
        ids[i.scoreId] = true;
        return {
          id: i.scoreId,
          link: to_proxy(i.pdf_complete),
          title: i.score_name,
          source: '',
        } as Score;
      })
      .filter(i => i && i.link) as Score[];
  },

  pdf_proxy: function(id: string, res: any) {
    request.get('https://app.box.com/shared/static/' + id + '.pdf').pipe(res);
  },
};

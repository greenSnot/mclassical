import express from 'express';
import service from '../service';
import { Score, Video } from '../types';
import { AudioWithAlbum } from '../model/audio_with_album';
import config from '../config';

const router = express.Router();
export default router;

router.get('/random', async function(req, res) {
  res.json({ code: 0, msg: 'ok', data: await service.random_audios(90) });
});

router.get('/pdf/:id', function(req, res) {
  const id = req.params['id'];
  service.pdf_proxy(id, res);
});

router.post('/search', async (req, res) => {
  const keyword: string = req.body.keyword;
  const page = parseInt(req.body.page);
  if (!keyword || keyword.length == 0) {
    res.json({});
    return;
  }
  const result: {
    code: number,
    type: string,
    videos: Video[],
    audios: AudioWithAlbum[],
    scores: Score[],
  } = {
    code: 0,
    type: req.body.type,
    videos: [],
    scores: [],
    audios: [],
  };

  if (!req.body.type) {
    res.json({ code: -1, msg: 'type is missing' });
    return;
  }
  if (req.body.type === 'score') {
    result.scores.push(
      ...await service.search_scores_db(keyword, page),
    );
  } else if (req.body.type == 'score_imslp') {
    result.scores.push(
      ...await service.search_scores_imslp(keyword),
    );
  } else if (req.body.type == 'video') {
    result.videos.push(...await service.search_videos(keyword, page));
  } else if (req.body.type == 'audio') {
    result.audios.push(...await service.search_audios(keyword, page));
  } else {
    res.json({ code: -2, msg: 'type error' });
    return;
  }

  res.header('Access-Control-Allow-Origin', `${config.frontend_domain}:${config.frontend_port}`);
  res.json(result);
});

import { MongoClient } from 'mongodb';
import { AudioWithAlbum } from '../model/audio_with_album';
import { Score } from '../model/score';
import { ScoreRelation } from '../model/score_relation';
import { ScoreName } from '../model/score_name';
import { ScoreComposer } from '../model/score_composer';
import { ScoreInstrument } from '../model/score_instrument';
import { ScoreForm } from '../model/score_form';
import { ScorePDFPart } from '../model/score_pdf_part';

const url = 'mongodb://127.0.0.1:27017';

export async function do_migrate(mysql_connection: any) {
  // do_migrate_audios(mysql_connection);
  // do_migrate_scores(mysql_connection);
}

async function do_migrate_scores(mysql_connection: any) {
  const repository_score = mysql_connection.getRepository(Score);
  const repository_score_relation = mysql_connection.getRepository(ScoreRelation);
  const repository_score_form = mysql_connection.getRepository(ScoreForm);
  const repository_score_name = mysql_connection.getRepository(ScoreName);
  const repository_score_composer = mysql_connection.getRepository(ScoreComposer);
  const repository_score_instrument = mysql_connection.getRepository(ScoreInstrument);
  const repository_score_pdf_part = mysql_connection.getRepository(ScorePDFPart);

  // reset
  const runner = mysql_connection.createQueryBuilder();
  await runner.delete().from(ScoreComposer).execute();
  await runner.delete().from(ScoreForm).execute();
  await runner.delete().from(ScoreName).execute();
  await runner.delete().from(ScoreRelation).execute();
  await runner.delete().from(ScoreInstrument).execute();
  await runner.delete().from(ScorePDFPart).execute();
  await runner.delete().from(Score).execute();

  MongoClient.connect(url, async (err, client) => {
    console.log('mongo connected');
    const db = client.db('mclassical');
    let needsBreak = false;
    let step = 100;
    let cursor = 0;
    while (!needsBreak) {
      console.log('cursor: ' + cursor);
      needsBreak = await new Promise(resolve =>
        db
          .collection('SCMD_composers')
          .find({})
          .limit(step)
          .skip(cursor)
          .toArray(async function(err, items) {
            for (const item of items) {
              if (item === null || item.works.length === 0) {
                continue;
              }
              const composer = new ScoreComposer();
              composer.name = item.name[Object.keys(item.name)[0]].trim();
              await repository_score_composer.save(composer).catch((e: any) => console.log(e.message));

              for (const work of item.works) {
                const score = new Score();
                score.instruments = [];
                score.composers = [composer];
                score.forms = [];
                score.names = [];
                score.pdf_parts = [];
                for (const lang of Object.keys(work.name)) {
                  const i = new ScoreName();
                  i.name = work.name[lang].trim();
                  i.is_local_name = false;
                  i.lang = lang.trim();
                  await repository_score_name.save(i);
                  score.names.push(i);
                }
                for (const instrument_name of work.instruments) {
                  const i = new ScoreInstrument();
                  i.instrument_name = instrument_name.trim();
                  await repository_score_instrument.save(i);
                  score.instruments.push(i);
                }
                for (const form_name of work.forms) {
                  const i = new ScoreForm();
                  i.name = form_name.trim();
                  await repository_score_form.save(i);
                  score.forms.push(i);
                }
                score.mnx_complete = '';
                if (work.sheets.length) {
                  const complete = work.sheets.filter((x: any) => x.name.en.indexOf('Complete') >= 0)[0];
                  score.pdf_complete = complete ? complete.resources[0].url || '' : '';
                  for (const part of work.sheets) {
                    const p = new ScorePDFPart();
                    p.name = part.name.en.trim();
                    p.pdf_url = part.resources[0] ? part.resources[0].url : '';
                    await repository_score_pdf_part.save(p);
                    score.pdf_parts.push(p);
                  }
                } else {
                  score.pdf_complete = '';
                }
                await repository_score.save(score);
                const relation = new ScoreRelation();
                relation.score = score;
                await repository_score_relation.save(relation);
              }
            }
            if (items.length) {
              cursor += step;
              resolve(false);
            } else {
              resolve(true);
            }
          })
      );
    }
    client.close();
  });
}

function do_migrate_audios(mysql_connection: any) {
  const repository = mysql_connection.getRepository(AudioWithAlbum);
  MongoClient.connect(url, async (err, client) => {
    console.log('mongo connected');
    const db = client.db('mclassical');
    let needsBreak = false;
    let step = 100;
    let cursor = 0;
    while (!needsBreak) {
      console.log('cursor: ' + cursor);
      needsBreak = await new Promise(resolve =>
        db
          .collection('SCMD_audios')
          .find({})
          .limit(step)
          .skip(cursor)
          .toArray(function(err, items) {
            items.forEach(item => {
              if (item != null) {
                const audio_with_album = new AudioWithAlbum();
                audio_with_album.player = item.players.map((i: any) => i.name[Object.keys(i.name)[0]]).join('/');
                audio_with_album.uid = item.other_id.qqmusic_song_mid;
                const reference = item.references[Object.keys(item.references)[0]];
                audio_with_album.reference_url = reference.url;
                audio_with_album.source = reference.name;
                audio_with_album.album_name = item.album_name[Object.keys(item.album_name)[0]];
                audio_with_album.name = item.name[Object.keys(item.name)[0]];
                audio_with_album.album_sd = item.album_thumbnail;
                audio_with_album.album_hd = item.album_image;
                repository.save(audio_with_album).catch(() => {});
              }
            });
            if (items.length) {
              cursor += step;
              resolve(false);
            } else {
              resolve(true);
            }
          })
      );
    }

    client.close();
  });
}

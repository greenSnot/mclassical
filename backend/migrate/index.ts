import { MongoClient } from 'mongodb';
import { AudioWithAlbum } from '../model/audio_with_album';

const url = 'mongodb://127.0.0.1:27017';

export function do_migrate(mysql_connection: any) {
  // do_migrate_audios(mysql_connection);
  do_migrate_scores(mysql_connection);
}
function do_migrate_scores(mysql_connection: any) {
  // TODO
}

function do_migrate_audios(mysql_connection: any) {
  const repository = mysql_connection.getRepository(AudioWithAlbum);
  MongoClient.connect(url, async (err, client) => {
    console.log('mongo connected');
    const db = client.db('mclassical');
    let needsBreak = false;
    let step = 100;
    let cursor = 278000;
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

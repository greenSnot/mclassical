const shelljs = require('shelljs');
const os = require('os');
const path = require('path');
const fs = require('fs');
const sha1 = require('sha1');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

MongoClient.connect(url, async (err, client) => {
  db = client.db('mclassical');
  const retry = {};
  const nRetry = 4;
  const queue = [];
  const failed = [];
  let needsBreak = false;
  let step = 100;
  let cursor = 0;
  while (!needsBreak) {
    console.log('cursor: ' + cursor);
    needsBreak = await new Promise(resolve => db.collection('musopen_composers').find({}).limit(step).skip(cursor).toArray(function(err, items) {
      items.forEach(item => {
        if (item != null && item.works && item.works.length) {
          item.works.forEach(work => {
            work.resources && work.resources.forEach(resource => {
              queue.push(sha1(resource.url));
            });
          });
        }
      });
      if (items.length) {
        cursor += step;
        resolve(false);
      } else {
        resolve(true);
      }
    }));
  }

  let t = 0;
  while (t < queue.length) {
    console.log('@@@ ' + t + '/' + queue.length);
    await Promise.all([
      queue[t],
    ].filter(i => i).map(i =>
      new Promise(resolve => {
        console.log('start:' + i);
        let cp;
        const checkRetry = () => {
          if (retry[i] === undefined) {
            retry[i] = nRetry;
            queue.push(i);
            console.log('###retry ' + i, retry[i]);
          } else if (retry[i] > 0) {
            retry[i]--;
            queue.push(i);
            console.log('###retry ' + i, retry[i]);
          } else {
            console.log('###failed ' + i);
            fs.appendFileSync(path.join(__dirname, 'failed'), i + '\n');
          }
        }

        const dir = i.substr(0, 2);
        const root = path.join('/Volumes/P0', 'data');
        // const root = path.join(__dirname, 'data');
        const dest = path.join(root, path.join(dir, `${i}.pdf`));
        if (fs.existsSync(dest)) {
          resolve();
          return;
        }
        const To = setTimeout(() => {
          console.log('####timeout ' + i);
          checkRetry();
          try {
            cp.kill();
          } catch(e) {
            console.log(e);
          }
          resolve();
        }, 5 * 60 * 1000);
        const temp_dest = path.join(os.tmpdir(), `${i}.pdf`);

        const shell = `rm -f ${temp_dest} && ${path.join(__dirname, 'qrsctl.dms')} get scores musopen/${i}.pdf ${temp_dest}`;

        cp = shelljs.exec(shell, function(code, stdout, stderr) {
          if (code) {
            console.log('Exit code:', code, i);
            checkRetry();
          } else {
            shelljs.exec(`mv -f ${temp_dest} ${dest}`, {async: false});
            console.log('###ok', i);
          }
          clearTimeout(To);
          resolve();
        });
      })
    ));
    ++t;
  }
  fs.writeFileSync(path.join(__dirname, 'failed'), failed.toString());

  client.close();
});

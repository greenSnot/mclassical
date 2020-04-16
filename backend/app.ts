import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import index from './routes';
import config from './config';
import path from 'path';
import { getConnection } from './db';

const app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', `${config.frontend_domain}:${config.frontend_port}`);
	res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', index);

getConnection().then(() => {
  app.listen(config.backend_port, () => console.log('listening'));
});

app.use(function (err: any, req: any, res: any, next: any) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

export default app;

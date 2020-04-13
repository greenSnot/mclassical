import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import index from './routes';
import config from './config';
import { getConnection } from './db';

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', index);

getConnection().then(() => {
  app.listen(config.port, () => console.log('listening'));
});

export default app;

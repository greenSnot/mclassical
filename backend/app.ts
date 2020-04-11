import express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import path from 'path';
import bodyParser from 'body-parser';
import compression from 'compression';
import config from './config';
import index from './routes';
import { do_migrate } from './migrate';

const app = express();

createConnection({
  ...config.typeorm_connection,
  entities: [
    path.join(__dirname, './model/*.ts'),
  ],
})
  .then(connection => {
    console.log('connected');
    do_migrate(connection);
  })
  .catch(error => console.log(error));

app.use('/', index);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

export default app;

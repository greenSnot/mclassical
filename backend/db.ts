import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import { do_migrate } from './migrate';
import path from 'path';
import config from './config';

let connection_resolve: Function;

const connection_promise = new Promise<Connection>(resolve => {
  connection_resolve = resolve;
});

createConnection({
  ...config.typeorm_connection,
  entities: [
    path.join(__dirname, './model/*.ts'),
  ],
})
  .then(con => {
    console.log('mysql connected');
    connection_resolve(con);
    do_migrate(con);
  })
  .catch(error => console.log(error));

export async function getConnection() {
  return await connection_promise;
}

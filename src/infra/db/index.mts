import type { Knex } from 'knex';
import { fileURLToPath } from 'url';
import { resolve } from 'path';
import knex from 'knex';
import { DATABASE as config } from '../../config.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const buildConnectionConfig = (): Knex.Config => {
  return {
    client: 'pg',
    connection: {
      host: config.DB_HOST,
      port: config.DB_PORT,
      user: config.DB_USERNAME,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
    },
    migrations: {
      directory: resolve(__dirname, '../../../data/migrations'),
      extension: 'mjs',
      loadExtensions: ['.mjs'],
    },
    seeds: {
      directory: resolve(__dirname, '../../../data/seeds'),
      extension: 'mjs',
      loadExtensions: ['.mjs'],
    },
  };
};

const createConnection = () => {
  return knex(buildConnectionConfig());
};

export { createConnection, buildConnectionConfig };

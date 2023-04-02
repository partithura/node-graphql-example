import type { Knex } from 'knex';
import { resolve } from 'node:path';
import knex from 'knex';
import { DATABASE as config } from '../../config';

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
      directory: resolve(__dirname, './migrations'),
      // directory: resolve(__dirname, '../../../data/migrations'),
      extension: 'ts',
      loadExtensions: ['.ts', '.js'],
    },
    seeds: {
      directory: resolve(__dirname, './seeds'),
      // directory: resolve(__dirname, '../../../data/seeds'),
      extension: 'ts',
      loadExtensions: ['.js', '.ts'],
    },
  };
};

const createConnection = () => {
  return knex(buildConnectionConfig());
};

export { createConnection, buildConnectionConfig };

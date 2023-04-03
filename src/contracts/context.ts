import type { Knex } from 'knex';

export interface Context {
  db: Knex;
}

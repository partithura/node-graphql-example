import type { Knex } from 'knex';
import { buildConnectionConfig } from './index.mjs';

export default async (): Promise<Knex.Config> => {
  return {
    ...buildConnectionConfig(),
  };
};

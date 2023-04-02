import type { Knex } from 'knex';
import { buildConnectionConfig } from './index';

export default async (): Promise<Knex.Config> => {
  return {
    ...buildConnectionConfig(),
  };
};

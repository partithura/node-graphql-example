import { Knex } from 'knex';
import { ulid } from 'ulidx';

const createRecord = () => ({
  id: ulid(),
  name: 'John Doe',
});

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  await knex('users').insert(Array.from({ length: 10 }).map(createRecord));
}

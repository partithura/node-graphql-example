import { Knex } from 'knex';
import { ulid } from 'ulidx';
import { faker } from '@faker-js/faker/locale/pt_BR';

const createRecord = () => ({
  id: ulid(),
  name: faker.name.fullName(),
});

export async function seed(knex: Knex): Promise<void> {
  const length = faker.datatype.number({ min: 10, max: 100 });

  await knex('users').del();

  await knex('users').insert(Array.from({ length }).map(createRecord));
}

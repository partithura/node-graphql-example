import ulidx from 'ulidx';

const createRecord = () => ({
  id: ulidx.ulid(),
  name: 'John Doe',
});

export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert(Array(10).fill().map(createRecord));
};

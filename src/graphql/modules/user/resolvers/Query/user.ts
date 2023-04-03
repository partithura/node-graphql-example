import type { QueryResolvers } from './../../../types.generated';
export const user: NonNullable<QueryResolvers['user']> = async (
  _parent,
  { id },
  { db }
) => {
  return await db('users').where({ id }).first();
};

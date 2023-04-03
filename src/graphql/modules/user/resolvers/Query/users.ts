import type { QueryResolvers } from './../../../types.generated';
export const users: NonNullable<QueryResolvers['users']> = async (
  _parent,
  _arg,
  { db }
) => {
  const users = await db('users');
  return users;
};

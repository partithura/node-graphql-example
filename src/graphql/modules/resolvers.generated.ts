/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { user as Query_user } from './user/resolvers/Query/user';
import    { users as Query_users } from './user/resolvers/Query/users';
import    { User } from './user/resolvers/User';
    export const resolvers: Resolvers = {
      Query: { user: Query_user,users: Query_users },
      
      
      User: User
    }
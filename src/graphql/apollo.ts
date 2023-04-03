import type { BaseContext } from '@apollo/server';
import type { FastifyInstance } from 'fastify';

import { ApolloServer } from '@apollo/server';

import { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import { resolvers } from './modules/resolvers.generated';
import { typeDefs } from './modules/typeDefs.generated';

const buildApolloServer = async (
  app: FastifyInstance
): Promise<ApolloServer<BaseContext>> => {
  const apollo = new ApolloServer<BaseContext>({
    typeDefs,
    resolvers,
    plugins: [fastifyApolloDrainPlugin(app)],
  });

  return apollo;
};

export { buildApolloServer };

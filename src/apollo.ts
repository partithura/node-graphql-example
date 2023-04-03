import type { BaseContext } from '@apollo/server';
import type { FastifyInstance } from 'fastify';
import type { Resolvers } from './__generated__/resolvers-types';

import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { ApolloServer } from '@apollo/server';

import { fastifyApolloDrainPlugin } from '@as-integrations/fastify';

const schemaFile = resolve(__dirname, '../schemas/schema.graphql');

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const resolvers: Resolvers = {
  Query: {
    books: () => books,
  },
};

const buildApolloServer = async (
  app: FastifyInstance
): Promise<ApolloServer<BaseContext>> => {
  const typeDefs = await readFile(schemaFile, {
    encoding: 'utf-8',
  });

  const apollo = new ApolloServer<BaseContext>({
    typeDefs,
    resolvers,
    plugins: [fastifyApolloDrainPlugin(app)],
  });

  return apollo;
};

export { buildApolloServer };

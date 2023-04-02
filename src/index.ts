import type { BaseContext } from '@apollo/server';
import { ApolloServer } from '@apollo/server';
import fastify from 'fastify';
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from '@as-integrations/fastify';
import { resolve } from 'node:path';

import { readFileSync } from 'node:fs';
import { Resolvers } from './__generated__/resolvers-types';
import { PORT } from './config';

const schemaFile = resolve(__dirname, '../schemas/schema.graphql');

const app = fastify();
const typeDefs = readFileSync(schemaFile, {
  encoding: 'utf-8',
});

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

const apollo = new ApolloServer<BaseContext>({
  typeDefs,
  resolvers,
  plugins: [fastifyApolloDrainPlugin(app)],
});

(async () => {
  await apollo.start();
  await app.register(fastifyApollo(apollo));

  const url = await app.listen({
    port: PORT,
  });

  console.log(`🚀  Server ready at: ${url}`);
})().catch(console.error);

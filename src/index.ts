import fastifyApollo from '@as-integrations/fastify';

import { buildApolloServer } from './graphql/apollo';
import { buildServer } from './http-server';

import { getSignal } from './infra/signal';

const main = async (): Promise<void> => {
  const server = await buildServer(
    {
      signal: getSignal(),
    },
    async (app) => {
      const apollo = await buildApolloServer(app);
      await apollo.start();
      await app.register(fastifyApollo(apollo));
    }
  );

  try {
    await server.start();
  } catch (err) {
    await server.stop().catch(() => {}); // ignore error
    await Promise.reject(err);
  }
};

main().catch(console.error);

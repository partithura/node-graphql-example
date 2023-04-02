import { buildApolloServer } from './apollo';
import fastifyApollo from '@as-integrations/fastify';
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
    server.start();
  } catch (err) {
    await server.stop().catch(() => {}); // ignore error
    return Promise.reject(err);
  }
};

main().catch(console.error);

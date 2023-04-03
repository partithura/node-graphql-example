import type { ApolloFastifyContextFunction } from '@as-integrations/fastify';
import type { Context } from './contracts/context';

import fastifyApollo from '@as-integrations/fastify';
import { createConnection } from './infra/db';
import { buildApolloServer } from './graphql/apollo';
import { buildServer } from './http-server';

import { getSignal } from './infra/signal';

const main = async (): Promise<void> => {
  const conn = createConnection();
  const contextBuilder: ApolloFastifyContextFunction<Context> = async () => {
    return {
      db: conn,
    };
  };

  const server = await buildServer(
    {
      signal: getSignal(),
    },
    async (app) => {
      const apollo = await buildApolloServer(app);
      await apollo.start();
      await app.register(fastifyApollo(apollo), {
        // @ts-expect-error - We must investigate this
        context: contextBuilder,
      });
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

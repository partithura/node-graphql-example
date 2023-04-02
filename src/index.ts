import fastify from 'fastify';
import { buildApolloServer } from './apollo';
import fastifyApollo from '@as-integrations/fastify';

import { PORT } from './config';

const main = async (): Promise<void> => {
  const app = fastify();

  const apollo = await buildApolloServer(app);
  await apollo.start();
  await app.register(fastifyApollo(apollo));

  const url = await app.listen({
    port: PORT,
  });

  console.log(`🚀  Server ready at: ${url}`);
};

main().catch(console.error);

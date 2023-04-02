import type { BaseContext } from "@apollo/server";
import { ApolloServer } from "@apollo/server";
import fastify from "fastify";
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from "@as-integrations/fastify";

import { readFileSync } from "node:fs";
import { Resolvers } from "./__generated__/resolvers-types";

const schemaFile = new URL("../schemas/schema.graphql", import.meta.url);

const app = fastify();
const typeDefs = readFileSync(schemaFile, {
  encoding: "utf-8",
});

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
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

await apollo.start();
await app.register(fastifyApollo(apollo));

const url = await app.listen({
  port: 8080,
});

console.log(`🚀  Server ready at: ${url}`);

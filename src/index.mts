import type { BaseContext } from "@apollo/server";
import { ApolloServer } from "@apollo/server";
import fastify from "fastify";
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from "@as-integrations/fastify";

const app = fastify();

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

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

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
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

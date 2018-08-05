import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
`;

const resolvers = {
  Query: {
    hello: (_: any, { name }: any) => `Bye ${name || "World"}`
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is running on localhost:4000"));
// https://www.youtube.com/watch?v=s2nre7qbhYY&list=PLN3n1USn4xlky9uj6wOhfsPez7KZOqm2V&index=3

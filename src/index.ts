import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { resolvers } from "./resolvers";
import { createConnection } from "typeorm";

const server = new GraphQLServer({ typeDefs: "src/schema.graphql", resolvers });
createConnection().then(() => {
  server.start(() => console.log("Server is running on localhost:4000"));
});
// https://www.youtube.com/watch?v=23w8PSHwep0&list=PLN3n1USn4xlky9uj6wOhfsPez7KZOqm2V&index=6

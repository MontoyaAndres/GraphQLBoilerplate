import { GraphQLServer } from "graphql-yoga";

import { createTypeormConn } from "./utils/createTypeormConn";
import { redis } from "./redis";
import { genSchema } from "./utils/genSchema";
import Router from "./routes";

export const startServer = async () => {
	const server = new GraphQLServer({
		schema: genSchema(),
		context: ({ request }) => ({
			redis,
			url: request.protocol + "://" + request.get("host")
		})
	});

	// Routes
	server.express.use(Router);

	await createTypeormConn();

	const app = await server.start({
		port: process.env.NODE_ENV === "test" ? 0 : 4000
	});

	return app;
};

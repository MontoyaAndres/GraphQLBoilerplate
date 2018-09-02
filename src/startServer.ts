import "dotenv/config";
import { GraphQLServer } from "graphql-yoga";
import * as session from "express-session";
import * as connectRedis from "connect-redis";

import { createTypeormConn } from "./utils/createTypeormConn";
import { redis } from "./redis";
import { genSchema } from "./utils/genSchema";
import Router from "./routes";

const RedisStore = connectRedis(session);

export const startServer = async () => {
	const server = new GraphQLServer({
		schema: genSchema(),
		context: ({ request }) => ({
			redis,
			url: request.protocol + "://" + request.get("host"),
			session: request.session
		})
	});

	server.express.use(Router).use(
		session({
			store: new RedisStore({
				client: redis as any
			}),
			name: "qid",
			secret: process.env.SESSION_SECRET || "",
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
			}
		})
	);

	const cors = {
		credentials: true,
		origin: "http://localhost:3000" // front end url
	};

	await createTypeormConn();

	const app = await server.start({
		cors,
		port: process.env.NODE_ENV === "test" ? 0 : 4000
	});

	return app;
};

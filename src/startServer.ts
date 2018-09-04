import "dotenv/config";
import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import * as session from "express-session";
import * as connectRedis from "connect-redis";

import { createTypeormConn } from "./utils/createTypeormConn";
import { redis } from "./redis";
import { genSchema } from "./utils/genSchema";
import Router from "./routes";
import { redisSessionPrefix } from "./constants";

const RedisStore = connectRedis(session);

export const startServer = async () => {
	const server = new GraphQLServer({
		schema: genSchema(),
		context: ({ request }) => ({
			redis,
			url: request.protocol + "://" + request.get("host"),
			session: request.session,
			req: request
		})
	});

	server.express.use(Router).use(
		session({
			store: new RedisStore({
				client: redis as any,
				prefix: redisSessionPrefix
			}),
			name: "qid",
			secret: process.env.SESSION_SECRET as string,
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
		origin:
			process.env.NODE_ENV === "test"
				? "*"
				: (process.env.FRONTEND_HOST as string)
	};

	await createTypeormConn();

	const app = await server.start({
		cors,
		port: process.env.NODE_ENV === "test" ? 0 : 4000
	});

	return app;
};

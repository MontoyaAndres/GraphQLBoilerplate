import "dotenv/config";
import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import * as RateLimit from "express-rate-limit";
import * as RateLimitRedisStore from "rate-limit-redis";

import { createTypeormConn } from "./utils/createTypeormConn";
import { redis } from "./redis";
import { genSchema } from "./utils/genSchema";
import Router from "./routes";
import { createTestConn } from "./testSetup/createTestConn";

const RedisStore = connectRedis(session);

export const startServer = async () => {
	if (process.env.NODE_ENV === "test") {
		// clean state
		await redis.flushall();
	}

	const server = new GraphQLServer({
		schema: genSchema() as any,
		context: ({ request }) => ({
			redis,
			url: request.protocol + "://" + request.get("host"),
			session: request.session,
			req: request
		})
	});

	server.express.use(
		new RateLimit({
			store: new RateLimitRedisStore({
				client: redis
			}),
			windowMs: 15 * 60 * 1000, // 15 minutes
			max: 100, // Limit each IP to 100 requests per windowsMs
			delayMs: 0 // Disable delaying - full speed until the max limit is reached
		})
	);

	server.express.use(
		session({
			store: new RedisStore({
				client: redis as any
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

	server.express.use(Router);

	if (process.env.NODE_ENV === "test") {
		await createTestConn(true);
	} else {
		await createTypeormConn();
	}

	const app = await server.start({
		cors,
		port: process.env.NODE_ENV === "test" ? 0 : 4000
	});

	return app;
};

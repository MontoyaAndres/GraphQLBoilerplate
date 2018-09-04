import { Redis } from "ioredis";

interface Session extends Express.Session {
	userId?: string;
}

interface Context {
	redis: Redis;
	url: string;
	session: Session;
	req: Express.Request;
}

export type Resolver = (
	parent: any,
	args: any,
	context: Context,
	info: any
) => any;

export type GraphQLMiddlewareFunc = (
	resolver: Resolver,
	parent: any,
	args: any,
	context: Context,
	info: any
) => any;

export interface ResolveMap {
	[key: string]: {
		[key: string]: Resolver;
	};
}

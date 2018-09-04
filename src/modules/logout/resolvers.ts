import { ResolveMap } from "../../types/graphql-utils";
import { userSessionIdPrefix, redisSessionPrefix } from "../../constants";

export const resolvers: ResolveMap = {
	Query: {
		hello: () => "hello"
	},
	Mutation: {
		logout: async (_, __, { session, redis }) => {
			const { userId } = session;
			if (userId) {
				const sessionIds = await redis.lrange(
					`${userSessionIdPrefix}${userId}`,
					0,
					-1
				);

				const promises = [];
				for (const i of sessionIds) {
					promises.push(redis.del(`${redisSessionPrefix}${sessionIds[i]}`));
				}
				await Promise.all(promises);
				return true;
			}

			return false;
		}
	}
};

import { Redis } from "ioredis";
import { userSessionIdPrefix, redisSessionPrefix } from "../constants";

export const removeAllUsersSessions = async (userId: string, redis: Redis) => {
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
};

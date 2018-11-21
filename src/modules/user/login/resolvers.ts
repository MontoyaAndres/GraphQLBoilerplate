import * as bcrypt from "bcryptjs";

import { ResolveMap } from "../../../types/graphql-utils";
import { GQL } from "../../../types/schema";
import { User } from "../../../entity/User";
import {
	invalidLogin,
	confirmEmailError,
	forgotPasswordLockedError
} from "./errorMessages";
import { userSessionIdPrefix } from "../../../constants";

const errorResponse = [
	{
		path: "email",
		message: invalidLogin
	}
];

export const resolvers: ResolveMap = {
	Mutation: {
		login: async (
			_,
			{ email, password }: GQL.ILoginOnMutationArguments,
			{ session, redis, req }
		) => {
			const user = await User.findOne({ where: { email } });

			if (!user) {
				return errorResponse;
			}

			if (!user.confirmed) {
				return [
					{
						path: "email",
						message: confirmEmailError
					}
				];
			}

			if (user.forgotPasswordLocked) {
				return [
					{
						path: "email",
						message: forgotPasswordLockedError
					}
				];
			}

			const valid = await bcrypt.compare(password, user.password as string);

			if (!valid) {
				return errorResponse;
			}

			// login successful
			session.userId = user.id;
			if (req.sessionID) {
				await redis.lpush(`${userSessionIdPrefix}${user.id}`, req.sessionID);
			}

			return null;
		}
	}
};

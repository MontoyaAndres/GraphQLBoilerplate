import * as yup from "yup";

import { ResolveMap } from "../../types/graphql-utils";
import { GQL } from "../../types/schema";
import { User } from "../../entity/User";
import { formatYupError } from "../../utils/formatYupError";
import {
	duplicateEmail,
	emailNotLongEnough,
	invalidEmail,
	passwordNotLongEnough
} from "./errorMessages";
/* import { createConfimEmailLink } from "../../utils/createConfirmEmailLink";
import { sendEmail } from "../../utils/sendEmail"; */

const schema = yup.object().shape({
	email: yup
		.string()
		.min(3, emailNotLongEnough)
		.max(255)
		.email(invalidEmail),
	password: yup
		.string()
		.min(3, passwordNotLongEnough)
		.max(255)
});

export const resolvers: ResolveMap = {
	Query: {
		hello: () => "hello"
	},
	Mutation: {
		register: async (
			_,
			args: GQL.IRegisterOnMutationArguments
			/* { redis, url } */
		) => {
			try {
				await schema.validate(args, { abortEarly: false });
			} catch (err) {
				return formatYupError(err);
			}

			const { email, password } = args;

			const userAlreadyExists = await User.findOne({
				where: { email },
				select: ["id"]
			});

			if (userAlreadyExists) {
				return [
					{
						path: "email",
						message: duplicateEmail
					}
				];
			}

			const user = User.create({
				email,
				password
			});

			await user.save();

			/* if (process.env.NODE_ENV !== "test") {
				await sendEmail(
					email,
					await createConfimEmailLink(url, user.id, redis)
				);
			} */

			return null;
		}
	}
};

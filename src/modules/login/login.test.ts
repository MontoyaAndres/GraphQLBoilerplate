// tslint:disable-next-line:no-implicit-dependencies
import { request } from "graphql-request";

import { createTypeormConn } from "../../utils/createTypeormConn";
import { invalidLogin, confirmEmailError } from "./errorMessages";
import { User } from "../../entity/User";

const email = "tom@tom.com";
const password = "sdas";

const registerMutation = (e: string, p: string) => `
	mutation {
		register(email: "${e}", password: "${p}") {
			path
			message
		}
	}
`;

const loginMutation = (e: string, p: string) => `
	mutation {
		login(email: "${e}", password: "${p}") {
			path
			message
		}
	}
`;

beforeAll(async () => {
	await createTypeormConn();
});

const loginExceptError = async (e: string, p: string, errMsg: string) => {
	const response = await request(
		process.env.TEST_HOST as string,
		loginMutation(e, p)
	);

	expect(response).toEqual({
		login: [
			{
				path: "email",
				message: errMsg
			}
		]
	});
};

describe("login", () => {
	test("email not found send back error", async () => {
		await loginExceptError("bob@bob.com", "sdasdas", invalidLogin);
	});

	test("email not confirmed", async () => {
		await request(
			process.env.TEST_HOST as string,
			registerMutation(email, password)
		);

		await loginExceptError(email, password, confirmEmailError);

		await User.update({ email }, { confirmed: true });

		await loginExceptError(email, "asdasdas", invalidLogin);

		const response = await request(
			process.env.TEST_HOST as string,
			loginMutation(email, password)
		);

		expect(response).toEqual({ login: null });
	});
});

import { Connection } from "typeorm";

import { createTypeormConn } from "../../utils/createTypeormConn";
import { invalidLogin, confirmEmailError } from "./errorMessages";
import { User } from "../../entity/User";
import { TestClient } from "../../utils/testClient";

const email = "tom@tom.com";
const password = "sdas";

let conn: Connection;

beforeAll(async () => {
	conn = await createTypeormConn();
});

afterAll(async () => {
	conn.close();
});

const loginExceptError = async (
	client: TestClient,
	e: string,
	p: string,
	errMsg: string
) => {
	const response = await client.login(e, p);

	expect(response.data).toEqual({
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
		const client = new TestClient(process.env.TEST_HOST as string);
		await loginExceptError(client, "bob@bob.com", "sdasdas", invalidLogin);
	});

	test("email not confirmed", async () => {
		const client = new TestClient(process.env.TEST_HOST as string);
		await client.register(email, password);

		await loginExceptError(client, email, password, confirmEmailError);

		await User.update({ email }, { confirmed: true });

		await loginExceptError(client, email, "asdasdas", invalidLogin);

		const response = await client.login(email, password);

		expect(response.data).toEqual({ login: null });
	});
});

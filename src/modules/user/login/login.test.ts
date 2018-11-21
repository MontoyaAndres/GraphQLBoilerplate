import * as faker from "faker";
import { Connection } from "typeorm";

import { invalidLogin, confirmEmailError } from "./errorMessages";
import { User } from "../../../entity/User";
import { TestClient } from "../../../utils/testClient";
import { createTestConn } from "../../../testSetup/createTestConn";

// create a new thing (not repeat)
faker.seed(Date.now() + 1);
const email = faker.internet.email();
const password = faker.internet.password();

let conn: Connection;

beforeAll(async () => {
	conn = await createTestConn();
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
		await loginExceptError(
			client,
			faker.internet.email(),
			faker.internet.password(),
			invalidLogin
		);
	});

	test("email not confirmed", async () => {
		const client = new TestClient(process.env.TEST_HOST as string);
		await client.register(email, password);

		await loginExceptError(client, email, password, confirmEmailError);

		await User.update({ email }, { confirmed: true });

		await loginExceptError(
			client,
			email,
			faker.internet.password(),
			invalidLogin
		);

		const response = await client.login(email, password);

		expect(response.data).toEqual({ login: null });
	});
});

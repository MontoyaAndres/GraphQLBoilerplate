import { Connection } from "typeorm";
import * as faker from "faker";

import { User } from "../../../entity/User";
import {
	duplicateEmail,
	emailNotLongEnough,
	invalidEmail,
	passwordNotLongEnough
} from "./errorMessages";
import { TestClient } from "../../../utils/testClient";
import { createTestConn } from "../../../testSetup/createTestConn";

// create a new thing (not repeat)
faker.seed(Date.now() + 5);
const email: string = faker.internet.email();
const password: string = faker.internet.password();

let conn: Connection;

beforeAll(async () => {
	conn = await createTestConn();
});

afterAll(async () => {
	conn.close();
});

describe("Register user", () => {
	test("Make sure we can register a user", async () => {
		const client = new TestClient(process.env.TEST_HOST as string);

		const response = await client.register(email, password);
		expect(response.data).toEqual({ register: null });

		const users = await User.find({ where: { email } });
		expect(users).toHaveLength(1);

		const user = users[0];
		expect(user.email).toEqual(email);
		expect(user.password).not.toEqual(password);
	});

	test("Test for duplicate emails", async () => {
		const client = new TestClient(process.env.TEST_HOST as string);

		const response = await client.register(email, password);
		expect(response.data.register).toHaveLength(1);
		expect(response.data.register[0]).toEqual({
			path: "email",
			message: duplicateEmail
		});
	});

	test("Check bad email", async () => {
		const client = new TestClient(process.env.TEST_HOST as string);

		const response = await client.register("b", password);

		expect(response.data).toEqual({
			register: [
				{
					path: "email",
					message: emailNotLongEnough
				},
				{
					path: "email",
					message: invalidEmail
				}
			]
		});
	});

	test("Check bad password", async () => {
		const client = new TestClient(process.env.TEST_HOST as string);

		const response = await client.register(faker.internet.email(), "ad");

		expect(response.data).toEqual({
			register: [
				{
					path: "password",
					message: passwordNotLongEnough
				}
			]
		});
	});

	test("Check bad password and bad email", async () => {
		const client = new TestClient(process.env.TEST_HOST as string);

		const response = await client.register("ds", "sd");

		expect(response.data).toEqual({
			register: [
				{
					path: "email",
					message: emailNotLongEnough
				},
				{
					path: "email",
					message: invalidEmail
				},
				{
					path: "password",
					message: passwordNotLongEnough
				}
			]
		});
	});
});

import { Connection } from "typeorm";

import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../entity/User";
import { TestClient } from "../../utils/testClient";

let userId: string;
let conn: Connection;

const email = "bob1@bob.com";
const password = "121321";

beforeAll(async () => {
	conn = await createTypeormConn();
	const user = await User.create({
		email,
		password,
		confirmed: true
	}).save();

	userId = user.id;
});

afterAll(async () => {
	conn.close();
});

describe("me function", () => {
	test("return null if not cookie", async () => {
		const client = new TestClient(process.env.TEST_HOST as string);
		const response = await client.me();

		expect(response.data.me).toBeNull();
	});

	test("get current user", async () => {
		const client = new TestClient(process.env.TEST_HOST as string);
		await client.login(email, password);
		const response = await client.me();

		expect(response.data).toEqual({
			me: {
				id: userId,
				email
			}
		});
	});
});

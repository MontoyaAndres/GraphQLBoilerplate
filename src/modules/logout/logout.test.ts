import { Connection } from "typeorm";

import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../entity/User";
import { TestClient } from "../../utils/testClient";

let conn: Connection;
const email = "bob@bob.com";
const password = "sdasdas";

let userId: string;

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

describe("logout", () => {
	test("test logging out a user", async () => {
		const client = new TestClient(process.env.TEST_HOST as string);

		await client.login(email, password);

		const response = await client.me();

		// login right
		expect(response.data).toEqual({
			me: {
				id: userId,
				email
			}
		});

		await client.logout();

		const response2 = await client.me();

		// logout right
		expect(response2.data.me).toBeNull();
	});
});

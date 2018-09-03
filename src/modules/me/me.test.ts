// tslint:disable-next-line:no-implicit-dependencies
import axios from "axios";
import { Connection } from "typeorm";

import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../entity/User";

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

const loginMutation = (e: string, p: string) => `
mutation {
	login(email: "${e}", password: "${p}") {
		path
		message
	}
}
`;

const meQuery = `
{
	me {
		id
		email
	}
}
`;

describe("me function", () => {
	test("get current user", async () => {
		await axios.post(
			process.env.TEST_HOST as string,
			{ query: loginMutation(email, password) },
			{ withCredentials: true }
		);

		const response = await axios.post(
			process.env.TEST_HOST as string,
			{ query: meQuery },
			{ withCredentials: true }
		);

		expect(response.data.data).toEqual({
			me: {
				id: userId,
				email
			}
		});
	});
});

// tslint:disable-next-line:no-implicit-dependencies
import axios from "axios";
import { Connection } from "typeorm";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../entity/User";

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

const logoutMutation = `
mutation {
	logout
}
`;

describe("logout", () => {
	test("test logging out a user", async () => {
		await axios.post(
			process.env.TEST_HOST as string,
			{ query: loginMutation(email, password) },
			{ withCredentials: true }
		);

		const response = await axios.post(
			process.env.TEST_HOST as string,
			{
				query: meQuery
			},
			{
				withCredentials: true
			}
		);

		// login right
		expect(response.data.data).toEqual({
			me: {
				id: userId,
				email
			}
		});

		await axios.post(
			process.env.TEST_HOST as string,
			{ query: logoutMutation },
			{ withCredentials: true }
		);

		const response2 = await axios.post(
			process.env.TEST_HOST as string,
			{
				query: meQuery
			},
			{
				withCredentials: true
			}
		);

		// logout right
		expect(response2.data.data.me).toBeNull();
	});
});

// tslint:disable-next-line:no-implicit-dependencies
import fetch from "node-fetch";
import * as Redis from "ioredis";
import { Connection } from "typeorm";

import { createConfimEmailLink } from "./createConfirmEmailLink";
import { createTypeormConn } from "./createTypeormConn";
import { User } from "../entity/User";

let userId: string;
const redis = new Redis();

let conn: Connection;

beforeAll(async () => {
	conn = await createTypeormConn();
	const user = await User.create({
		email: "bob5@bob.com",
		password: "2312312"
	}).save();

	userId = user.id;
});

afterAll(async () => {
	conn.close();
});

test("Make sure it confirms user and clears key in redis", async () => {
	const url = await createConfimEmailLink(
		process.env.TEST_HOST as string,
		userId,
		redis
	);

	const response = await fetch(url);
	const text = await response.text();
	expect(text).toEqual("ok");

	const user = await User.findOne({ where: { id: userId } });
	expect((user as User).confirmed).toBeTruthy();

	const chunks = url.split("/");
	const key = chunks[chunks.length - 1];
	const value = await redis.get(key);
	expect(value).toBeNull();
});

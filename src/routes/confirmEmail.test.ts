// tslint:disable-next-line:no-implicit-dependencies
import * as fetch from "node-fetch";

test("Sends invalid back if bad id sent", async () => {
	const response = await fetch(`${process.env.TEST_HOST}/confirm/2312312`);
	const text = await response.text();
	expect(text).toEqual("Invalid");
});

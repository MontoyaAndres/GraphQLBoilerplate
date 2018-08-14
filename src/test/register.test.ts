// tslint:disable-next-line:no-implicit-dependencies
import { request } from "graphql-request";
import { createConnection } from "typeorm";

import { host } from "./constants";
import { User } from "../entity/User";

const email = "tom1@bob1.com";
const password = "sdasda1";

const mutation = `
mutation {
  register(email: "${email}", password: "${password}")
}
`;

test("Register user", async () => {
  const response = await request(host, mutation);
  // expect a user created
  expect(response).toEqual({ register: true });

  // connect to the db
  await createConnection();

  // if the user exists
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);

  // if the user has the right data
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});

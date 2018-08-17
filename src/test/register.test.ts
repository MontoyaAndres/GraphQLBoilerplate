// tslint:disable-next-line:no-implicit-dependencies
import { request } from "graphql-request";

import { User } from "../entity/User";
import { startServer } from "../startServer";

let getHost = () => "";

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address();
  getHost = () => `http://localhost:${port}`;
});

const email = "bob@bob.com";
const password = "sdasda1";

const mutation = `
  mutation {
    register(email: "${email}", password: "${password}")
  }
`;

test("Register user", async () => {
  const response = await request(getHost(), mutation);
  // expect a user created
  expect(response).toEqual({ register: true });

  // if the user exists
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);

  // if the user has the right data
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});

// tslint:disable-next-line:no-implicit-dependencies
import { request } from "graphql-request";

import { startServer } from "../../startServer";
import { User } from "../../entity/User";

let getHost = () => "";

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address();
  getHost = () => `http://localhost:${port}`;
});

const email = "bob@bob.com";
const password = "121321";

const mutation = `
  mutation {
    register(email: "${email}", password: "${password}")
  }
`;

test("Register user", async () => {
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ register: true });

  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);

  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});

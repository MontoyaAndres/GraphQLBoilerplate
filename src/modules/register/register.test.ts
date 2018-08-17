// tslint:disable-next-line:no-implicit-dependencies
import { request } from "graphql-request";

import { startServer } from "../../startServer";
import { User } from "../../entity/User";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} from "./errorMessages";

let getHost: string = "";

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address();
  getHost = `http://localhost:${port}`;
});

const email: string = "bob@bob.com";
const password: string = "121321";

const mutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

describe("Register user", () => {
  test("Make sure we can register a user", async () => {
    const response = await request(getHost, mutation(email, password));
    expect(response).toEqual({ register: null });

    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);

    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });

  test("Test for duplicate emails", async () => {
    const response2: any = await request(getHost, mutation(email, password));
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0]).toEqual({
      path: "email",
      message: duplicateEmail
    });
  });

  test("Catch bad email", async () => {
    const response3: any = await request(getHost, mutation("bo", password));
    expect(response3).toEqual({
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

  test("Catch bad password", async () => {
    const response4: any = await request(getHost, mutation(email, "ad"));
    expect(response4).toEqual({
      register: [
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    });
  });

  test("Catch bad password and bad email", async () => {
    const response5: any = await request(getHost, mutation("df", "ad"));
    expect(response5).toEqual({
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

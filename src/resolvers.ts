import * as bcrypt from "bcryptjs";

import { ResolveMap } from "./types/graphql-utils";
import { GQL } from "./types/schema";
import { User } from "./entity/User";

export const resolvers: ResolveMap = {
  Query: {
    hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Bye ${name || "World"}`
  },
  Mutation: {
    register: async (
      _,
      { email, password }: GQL.IRegisterOnMutationArguments
    ) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        password: hashedPassword
      });
      await user.save();

      return true;
    }
  }
};

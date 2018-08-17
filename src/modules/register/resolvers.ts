import * as bcrypt from "bcryptjs";

import { ResolveMap } from "../../types/graphql-utils";
import { GQL } from "../../types/schema";
import { User } from "../../entity/User";

export const resolvers: ResolveMap = {
  Query: {
    hello: () => "hello"
  },
  Mutation: {
    register: async (
      _,
      { email, password }: GQL.IRegisterOnMutationArguments
    ) => {
      const hashedPassowrd = await bcrypt.hash(password, 10);

      const user = User.create({
        email,
        password: hashedPassowrd
      });

      await user.save();

      return true;
    }
  }
};

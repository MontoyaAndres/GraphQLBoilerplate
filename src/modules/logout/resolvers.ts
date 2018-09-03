import { ResolveMap } from "../../types/graphql-utils";

export const resolvers: ResolveMap = {
	Query: {
		hello: () => "hello"
	},
	Mutation: {
		logout: (_, __, { session }) =>
			new Promise(res =>
				session.destroy(err => {
					if (err) {
						console.log("logout error: ", err);
					}

					res(true);
				})
			)
	}
};

// if I want to add more content https://www.youtube.com/watch?v=dN7Gc2-BmXM&index=20&list=PLN3n1USn4xlky9uj6wOhfsPez7KZOqm2V

import { Resolver } from "../../types/graphql-utils";

export default async (
	resolver: Resolver,
	parent: any,
	args: any,
	context: any,
	info: any
) => {
	return resolver(parent, args, context, info);
};

import { join } from "path";
import { readdirSync } from "fs";
import { GraphQLSchema } from "graphql";
import { importSchema } from "graphql-import";
import { mergeSchemas, makeExecutableSchema } from "graphql-tools";

export const genSchema = () => {
	const schemas: GraphQLSchema[] = [];
	const folders = readdirSync(join(__dirname, "../modules"));

	folders.forEach(folder => {
		const { resolvers } = require(`../modules/${folder}/resolvers`);
		const typeDefs = importSchema(
			join(__dirname, `../modules/${folder}/schema.graphql`)
		);

		schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
	});

	return mergeSchemas({ schemas });
};

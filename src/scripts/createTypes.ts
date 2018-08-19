// tslint:disable-next-line:no-implicit-dependencies
import { generateNamespace } from "@gql2ts/from-schema";
import { writeFile } from "fs";
import { join } from "path";

import { genSchema } from "../utils/genSchema";

const typescriptTypes = generateNamespace("GQL", genSchema()).replace(
	/declare namespace GQL/gi,
	"export namespace GQL"
);

writeFile(join(__dirname, "../types/schema.d.ts"), typescriptTypes, err => {
	console.log(err);
});

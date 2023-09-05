import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { execute } from "./awaitExec.js";

export type DevDependency = {
	name: string;
	version: string;
};

type Script = {
	name: string;
	script?: string;
};

type Args = {
	add?: {
		scripts?: Array<Script>;
		devDependencies?: Array<string | DevDependency>;
	};
	remove?: {
		scripts?: Array<string>;
		devDependencies?: Array<string>;
	};
	cwd: string;
};

export const editPackageJSON = async ({ add, remove, cwd }: Args) => {
	if (add === undefined && remove === undefined) return;

	const fileData = JSON.parse(await readFile(join(cwd, "./package.json"), "utf-8"));

	if (add) {
		if (add.scripts) {
			for (const script of add.scripts) {
				if (script.script === undefined) continue;
				fileData.scripts[script.name] = script.script;
			}
		}
		if (add.devDependencies) {
			for (const dependency of add.devDependencies) {
				if (typeof dependency === "string") {
					const version = (await execute(`pnpm view ${dependency} version`)).stdout.slice(0, -1);
					fileData.devDependencies[dependency] = `^${version}`;
				} else {
					fileData.devDependencies[dependency.name] = dependency.version;
				}
			}
		}
	}

	if (remove) {
		if (remove.scripts) {
			for (const script of remove.scripts) {
				delete fileData.scripts[script];
			}
		}
		if (remove.devDependencies) {
			for (const dependency of remove.devDependencies) {
				delete fileData.devDependencies[dependency];
			}
		}
	}

	await writeFile(join(cwd, "./package.json"), JSON.stringify(fileData));
};

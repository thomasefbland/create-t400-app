import { mkdir, rm } from "fs/promises";
import { basename, join, resolve } from "path";
import { spinner } from "@clack/prompts";
import { create } from "create-svelte";
import { copy, mkdirp } from "fs-extra";
import { editPackageJSON } from "../../utils/editPackageJSON.js";
import { root } from "../../utils/rootDir.js";

type InstallerOptions = {
	cwd: string;
	testSuite: Array<string>;
};

export const installer = async ({ cwd, testSuite }: InstallerOptions) => {
	const s = spinner();
	s.start("Running SvelteKit Installer");

	await create(cwd, {
		name: basename(resolve(cwd)),
		template: "skeleton",
		types: "typescript",
		prettier: true,
		eslint: false,
		playwright: testSuite.includes("playwright"),
		vitest: testSuite.includes("vitest"),
	});

	await rm(resolve(cwd, "./README.md"));
	await rm(resolve(cwd, "./src"), { recursive: true });
	await copy(join(root, "./templates/web/sveltekit/src"), resolve(cwd, "./src"));
	await copy(join(root, "./templates/web/sveltekit/configs"), cwd);
	await copy(join(root, "./templates/web/sveltekit/_gitignore"), resolve(cwd, ".gitignore"));
	await copy(join(root, "./templates/web/sveltekit/_prettierignore"), resolve(cwd, ".prettierignore"));
	await copy(join(root, "./templates/web/sveltekit/_prettierrc"), resolve(cwd, ".prettierrc"));
	await mkdir(resolve(cwd, "./types"), { recursive: true });

	if (testSuite.length > 0) {
		await rm(resolve(cwd, "./tests"), { recursive: true });
		if (testSuite.includes("playwright")) await mkdirp(resolve(cwd, "./tests/integration"));
		if (testSuite.includes("vitest")) await mkdirp(resolve(cwd, "./tests/unit"));
		await copy(join(root, "./templates/web/sveltekit/types/tests"), resolve(cwd, "./types/tests"));
	}

	await editPackageJSON({
		cwd,
		add: {
			devDependencies: ["@sveltejs/adapter-vercel"],
		},
		remove: {
			devDependencies: ["@sveltejs/adapter-auto"],
			scripts: ["check:watch"],
		},
	});

	s.stop("✅ SvelteKit Installed");
};

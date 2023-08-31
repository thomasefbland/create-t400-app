import { mkdir } from "fs/promises";
import { join, resolve } from "path";
import { spinner, confirm, isCancel, cancel } from "@clack/prompts";
import { copy } from "fs-extra";
import { execute } from "../../utils/awaitExec.js";
import { editPackageJSON } from "../../utils/editPackageJSON.js";
import { root } from "../../utils/rootDir.js";
import { MESSAGES } from "../../utils/messages.js";

type InstallerOptions = {
	cwd: string;
};

export const installer = async ({ cwd }: InstallerOptions) => {
	const s = spinner();
	s.start("Running Supabase Installer");

	const usingAuthProviders = await confirm({
		message: "Will you be using SSO Providers for Auth?",
	});

	if (isCancel(usingAuthProviders)) {
		cancel(MESSAGES.CANCEL);
		process.exit(1);
	}

	await execute("supabase init");

	await mkdir(join(cwd, "./types/Database"));

	await copy(join(root, "./templates/web/supabase/gen-types.js"), resolve(cwd, "gen-types.js"));

	await editPackageJSON({
		cwd,
		add: {
			scripts: [{ name: "types", script: "supabase gen types typescript --local --schema public > types/Database/supabase.ts && node gen-types" }],
		},
	});

	await copy(join(root, "./templates/web/supabase/_env.local"), resolve(cwd, ".env.local"));

	if (usingAuthProviders) {
		await copy(join(root, "./templates/web/supabase/_env"), resolve(cwd, ".env"));
	}

	// TODO: Add Supabase SvelteKit auth helpers

	s.stop("✅ Supabase Installed");
};

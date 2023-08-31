import { cancel, log, spinner, outro } from "@clack/prompts";
import chalk from "chalk";
import { lookpath } from "lookpath";
import { MESSAGES } from "../../utils/messages.js";
import { installer as sveltekitInstaller } from "./sveltekit.js";
import { installer as tailwindcssInstaller } from "./tailwindcss.js";
import { installer as supabaseInstaller } from "./supabase.js";
import { installer as lucideInstaller } from "./lucide.js";
import { installer as meltUIInstaller } from "./melt-ui.js";
import { installer as vscodeInstaller } from "./vscode.js";

type InstallerOptions = {
	cwd: string;
	testSuite: Array<string>;
	baas: string | null;
};

export const installer = async (options: InstallerOptions) => {
	const { cwd, testSuite, baas } = options;

	log.info("Creating new T400 Web App");

	await sveltekitInstaller({ cwd, testSuite });

	await tailwindcssInstaller({ cwd });

	if (baas) {
		if (baas === "supabase") {
			const result = await lookpath("supabase");
			if (result === undefined) {
				log.error(chalk.red("Command supabase is not recognized. Try installing the supabase CLI globally?"));
				cancel(MESSAGES.TERMINATE);
				process.exit(1);
			}

			await supabaseInstaller({ cwd });
		}
		// TODO: Add SST Support
	}

	await meltUIInstaller({ cwd });
	await lucideInstaller({ cwd });
	await vscodeInstaller({ cwd, baas });

	// TODO: Add Github Actions

	outro("Complete: T400 Web App Bootstrapped");
};

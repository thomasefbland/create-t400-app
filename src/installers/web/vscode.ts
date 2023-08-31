import { join, resolve } from "path";
import { spinner } from "@clack/prompts";
import { copy } from "fs-extra";
import { root } from "../../utils/rootDir.js";

type InstallerOptions = {
	cwd: string;
	baas: string | null;
};

export const installer = async ({ cwd, baas }: InstallerOptions) => {
	const s = spinner();
	s.start("Running VSCode Settings Installer");

	if (baas === null) {
		await copy(join(root, "./templates/web/vscode/default.json"), resolve(cwd, ".vscode/settings.json"));
	} else if (baas === "supabase") {
		await copy(join(root, "./templates/web/vscode/supabase.json"), resolve(cwd, ".vscode/settings.json"));
	}

	s.stop("✅ VSCode Settings Installed");
};

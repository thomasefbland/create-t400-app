import { spinner } from "@clack/prompts";
import { editPackageJSON } from "../../utils/editPackageJSON.js";

type InstallerOptions = {
	cwd: string;
};

export const installer = async ({ cwd }: InstallerOptions) => {
	const s = spinner();
	s.start("Running Lucide Installer");

	await editPackageJSON({
		cwd,
		add: {
			devDependencies: ["lucide-svelte"],
		},
	});

	s.stop("✅ Lucide Installed");
};

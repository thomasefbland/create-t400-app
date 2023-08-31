import { spinner } from "@clack/prompts";
import { editPackageJSON } from "../../utils/editPackageJSON.js";

type InstallerOptions = {
	cwd: string;
};

export const installer = async ({ cwd }: InstallerOptions) => {
	const s = spinner();
	s.start("Running Melt UI Installer");

	await editPackageJSON({
		cwd,
		add: {
			devDependencies: ["@melt-ui/svelte"],
		},
	});

	s.stop("✅ Melt UI Installed");
};

import { spinner } from "@clack/prompts";
import { DevDependency, editPackageJSON } from "../../utils/editPackageJSON.js";

type InstallerOptions = {
	cwd: string;
};

export const installer = async ({ cwd }: InstallerOptions) => {
	const s = spinner();
	s.start("Running TailwindCSS Installer");

	const devDependencies: Array<string | DevDependency> =
		"tailwindcss postcss autoprefixer tailwindcss-animate prettier-plugin-tailwindcss postcss-import".split(" ");
	devDependencies.push({ name: "prettier-plugin-tailwindcss", version: "^0.2.1" });

	await editPackageJSON({
		cwd,
		add: {
			devDependencies,
		},
	});

	s.stop("✅ TailwindCSS Installed");
};

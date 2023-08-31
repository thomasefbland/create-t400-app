#!/usr/bin/env node
import { existsSync, readdirSync } from "fs";
import * as prompt from "@clack/prompts";
import chalk from "chalk";
import { Argument, Option, program } from "commander";
import { installer as webInstaller } from "./installers/web/index.js";
import { MESSAGES } from "./utils/messages.js";
import { title } from "./utils/title.js";

program
	.addArgument(new Argument("<dir>", "The directory to install the app in").argOptional())
	.addOption(new Option("-t, --appType <appType>", "What type of app to create").choices(["web", "npm"]))
	.addOption(new Option("-test, --testSuite <tests...>", "Which testing suite to install").choices(["vitest", "playwright"]))
	.addOption(new Option("-no-test, --noTestSuite", "Skip test suite prompts. Overrides --testSuite flag").implies({ testSuite: undefined }))
	.addOption(new Option("-baas, --baas <baas>", "Which BaaS to use").choices(["supabase", "sst", "none"]));

const parsed = program.parse(process.argv);

let cwd = parsed.processedArgs[0];
let appType: undefined | string = parsed.opts().appType;
let testSuite: undefined | Array<string> = parsed.opts().testSuite;
let noTestSuite: undefined | true = parsed.opts().noTestSuite;
let baas: undefined | string | null = parsed.opts().baas;

// TODO: Modulate and cleanup/majorly REDO this whole flag handling part
if (noTestSuite === true && testSuite !== undefined) {
	console.log(chalk.yellow.bold("Warning: "), chalk.yellow("Flag --noTestSuite overrides flag --testSuite\n"));
	testSuite = [];
}

if (appType === undefined) {
	if (testSuite !== undefined) {
		console.log(chalk.yellow.bold("Warning: "), chalk.yellow("Flag --testSuite is ignored while flag --appType is undefined"));
		testSuite = undefined;
	}
	if (baas !== undefined) {
		console.log(chalk.yellow.bold("Warning: "), chalk.yellow("Flag --baas is ignored while flag --appType is undefined"));
		baas = undefined;
	}
	console.log("\n");
} else if (appType === "npm") {
	if (testSuite !== undefined && testSuite.includes("playwright")) {
		console.log(chalk.yellow.bold("Warning: "), chalk.yellow("Option 'playwright' on flag --testSuite has no effect on app type 'npm'"));
	}
	if (baas !== undefined) {
		console.log(chalk.yellow.bold("Warning: "), chalk.yellow("Flag baas is not applicable to app type 'npm'"));
	}
	console.log("\n");
}
//

console.log(title + "\n");
prompt.intro(chalk.bgBlue.bold("Welcome to the T400 Stack"));

if (cwd === undefined) {
	const dir = await prompt.text({
		message: chalk.cyan("Where should we create your app?"),
		placeholder: "  (hit Enter to use current directory)",
	});

	if (prompt.isCancel(dir)) {
		prompt.outro(MESSAGES.CANCEL);
		process.exit(1);
	}

	if (dir !== undefined) {
		cwd = dir;
	} else {
		cwd = ".";
	}
}

if (existsSync(cwd)) {
	if (readdirSync(cwd).length > 0) {
		const force = await prompt.confirm({
			message: chalk.yellow("Directory not empty. Continue?"),
			initialValue: false,
		});

		if (prompt.isCancel(force)) {
			prompt.outro(MESSAGES.CANCEL);
			process.exit(1);
		}

		if (force === false) {
			prompt.cancel(chalk.red("Cancelling..."));
			process.exit(1);
		}
	}
}

if (appType === undefined) {
	const _appType = await prompt.select({
		message: chalk.cyan("What kind of app would you like to create?"),
		initialValue: "web",
		options: [
			{ value: "web", label: "Web Application" },
			{ value: "npm", label: "NPM Package" },
		],
	});

	if (prompt.isCancel(_appType)) {
		prompt.outro(MESSAGES.CANCEL);
		process.exit(1);
	}

	appType = _appType;
}

if (appType === "web") {
	if (testSuite === undefined) {
		if (noTestSuite !== true) {
			const _testSuite: symbol | string[] = await prompt.multiselect({
				message: chalk.cyan("Would you like to install a Testing Suite?"),
				required: false,
				options: [
					{
						value: "vitest",
						label: chalk.yellow("Vitest") + " for Unit Testing",
					},
					{
						value: "playwright",
						label: chalk.greenBright("Playwright") + " for Integration Testing",
					},
				],
			});

			if (prompt.isCancel(_testSuite)) {
				prompt.outro(MESSAGES.CANCEL);
				process.exit(1);
			}

			testSuite = _testSuite;
		} else testSuite = [];
	}

	if (baas === undefined) {
		const _baas: symbol | string = await prompt.select({
			message: chalk.cyan("Would you like to install a BaaS"),
			options: [
				{
					value: "none",
					label: "No",
				},
				{
					value: "supabase",
					label: chalk.hex("#2da875")("Supabase"),
				},
				{
					value: "sst",
					label: chalk.hex("#e37632")("SST") + chalk.dim(" (AWS)"),
				},
			],
		});

		if (prompt.isCancel(_baas)) {
			prompt.outro(MESSAGES.CANCEL);
			process.exit(1);
		}

		baas = _baas !== "none" ? _baas : null;
	} else if (baas === "none") baas = null;

	await webInstaller({ cwd, testSuite, baas });
}

// TODO: Add NPM Package support

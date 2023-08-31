import chalk from "chalk";

export const MESSAGES: { [key: string]: string } = {
	CANCEL: `^C${chalk.bgRed(" ELIFECYCLE ")} ${chalk.red("Terminating process with Exit Code 1")}`,
	TERMINATE: `${chalk.bgRed(" ELIFECYCLE ")} ${chalk.red("Terminating process with Exit Code 1")}`,
};

import { readFile, writeFile } from "fs/promises";

(async () => {
	const databaseFileContents = await readFile("./types/Database/supabase.ts", "utf-8");

	let fixedDatabaseFileContents = databaseFileContents;

	await writeFile("./types/Database/supabase.ts", fixedDatabaseFileContents);
})();

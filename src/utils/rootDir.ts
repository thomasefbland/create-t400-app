import { dirname, join } from "path";
import { fileURLToPath } from "url";

export const root = dirname(join(fileURLToPath(import.meta.url), "../../"));

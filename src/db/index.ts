import { drizzle } from "drizzle-orm/node-postgres";
import { getEnvs } from "../lib/utils/getEnvs.js";

export let db: ReturnType<typeof drizzle>;
// Resolves issues passing env vars for tests
if (process.env.NODE_ENV === "test") {
	getEnvs();
}

try {
	const dbURL = process.env.DATABASE_URL!;
	db = drizzle(dbURL);
} catch (error) {
	console.error("Error connecting to DB", error);
}

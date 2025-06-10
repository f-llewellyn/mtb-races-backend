import { drizzle } from "drizzle-orm/node-postgres";

import { config } from "../config.js";

export let db: ReturnType<typeof drizzle>;

export function initDb() {
	try {
		const dbURL = config.DATABASE_URL!;
		db = drizzle({ connection: dbURL, casing: "snake_case" });
	} catch (error) {
		console.error("Error connecting to DB", error);
	}
}

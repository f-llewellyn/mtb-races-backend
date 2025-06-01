import { db } from "../src/db";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export async function setup() {
	try {
		await migrate(db, { migrationsFolder: "./drizzle" });
	} catch (e) {
		console.error("Migration Failed", e);
		throw e;
	}
}

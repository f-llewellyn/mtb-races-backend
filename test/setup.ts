import { db, initDb } from '../src/db/index.ts';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

export async function setup() {
	initDb();
	try {
		await migrate(db, { migrationsFolder: './drizzle' });
		process.env.TZ = 'UTC';
	} catch (e) {
		console.error('Migration Failed', e);
		throw e;
	}
}

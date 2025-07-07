import { db, initDb } from '../src/db/index.ts';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { startPGBoss } from '../src/lib/queues/queues.ts';

export async function setup() {
	const boss = await startPGBoss();
	initDb();
	try {
		await migrate(db, { migrationsFolder: './drizzle' });
		process.env.TZ = 'UTC';
	} catch (e) {
		console.error('Migration Failed', e);
		throw e;
	} finally {
		await boss.stop();
	}
}

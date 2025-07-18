import { getDB } from '../src/db/index.js';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { getBoss } from '../src/pgboss/index.js';

export async function setup() {
	const boss = await getBoss();
	const db = await getDB();
	try {
		await migrate(db, { migrationsFolder: './drizzle' });
	} catch (e) {
		console.error('Migration Failed', e);
		throw e;
	} finally {
		await boss.stop();
	}
}

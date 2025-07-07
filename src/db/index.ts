import { drizzle } from 'drizzle-orm/node-postgres';

import { config } from '../config.ts';

export let db: ReturnType<typeof drizzle>;

export function initDb() {
	try {
		const dbURL = config.DATABASE_URL!;
		db = drizzle({
			connection: { connectionString: dbURL, max: 1 },
			casing: 'snake_case',
		});
		console.log('Succesfully connected to the DB');
	} catch (error) {
		console.error('Error connecting to DB', error);
	}
}

import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from '../config.js';

export type DB = ReturnType<typeof drizzle>;
let db: DB | undefined;
let DBPromise: Promise<DB> | undefined;

export async function getDB(): Promise<ReturnType<typeof drizzle>> {
	if (db) return db;

	if (!DBPromise) {
		DBPromise = initDB();
	}

	return DBPromise;
}

async function initDB() {
	try {
		const dbURL = config.DATABASE_URL!;
		db = drizzle({
			connection: dbURL,
			casing: 'snake_case',
		});
		console.log('Successfully connected to the DB');

		return db;
	} catch (error) {
		console.error('Error connecting to DB', error);
		db = undefined;
		DBPromise = undefined;
		throw error;
	}
}

export function resetDB(): void {
	db = undefined;
	DBPromise = undefined;
}

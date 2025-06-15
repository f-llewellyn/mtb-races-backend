import { scrapeSIEntries } from '../../lib/scrapers/si-entries/si-entries-scraper.js';
import { db } from '../../db/index.js';
import { racesTable, TRace } from '../../db/schema.js';
import { sql } from 'drizzle-orm';

export const getRaces = async (): Promise<TRace[]> => {
	return await getAllRaces();
};

export const scrapeRaces = async (): Promise<void> => {
	const races = await scrapeSIEntries();

	await db
		.insert(racesTable)
		.values(races)
		.onConflictDoUpdate({
			target: racesTable.hashedId,
			set: {
				date: sql`excluded.date`,
				location: sql`excluded.location`,
				detailsUrl: sql`excluded.details_url`,
			},
		});
};

async function getAllRaces() {
	return await db.select().from(racesTable);
}

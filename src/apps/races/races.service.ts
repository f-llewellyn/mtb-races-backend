import { scrapeSIEntries } from '../../lib/scrapers/si-entries/si-entries-scraper.ts';
import { db } from '../../db/index.ts';
import { racesTable, TRace } from '../../db/schema.ts';
import { desc, sql } from 'drizzle-orm';

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
	return await db.select().from(racesTable).orderBy(desc(racesTable.date));
}

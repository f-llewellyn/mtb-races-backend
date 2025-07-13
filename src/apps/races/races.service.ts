import { scrapeSIEntries } from '../../lib/scrapers/si-entries/si-entries-scraper.js';

import { racesTable, TRace } from '../../db/schema.js';
import { desc, notInArray, sql } from 'drizzle-orm';
import { getDB } from '../../db/index.js';

const db = await getDB();

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

	const raceHashes = races.map((race) => race.hashedId);

	await db
		.delete(racesTable)
		.where(notInArray(racesTable.hashedId, raceHashes));
};

async function getAllRaces() {
	return await db.select().from(racesTable).orderBy(desc(racesTable.date));
}

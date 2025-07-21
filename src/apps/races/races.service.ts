import { scrapeSIEntries } from '../../lib/scrapers/si-entries/si-entries.scraper.js';

import { racesTable, TRace, TRaceInsert } from '../../db/schema.js';
import { and, desc, eq, notInArray, sql } from 'drizzle-orm';
import { getDB } from '../../db/index.js';
import { Sources } from '../../enums/Sources.enum.js';
import { scrapeBritichCycling } from '../../lib/scrapers/british-cycling/british-cycling.scraper.js';

const db = await getDB();

const sourcesToScraperMap = {
	[Sources.SI_ENTRIES]: scrapeSIEntries,
	[Sources.BRITISH_CYCLING]: scrapeBritichCycling,
};

export const getRaces = async (): Promise<TRace[]> => {
	return await getAllRaces();
};

export const scrapeRaces = async (source: Sources): Promise<void> => {
	const scraperFunction = sourcesToScraperMap[source];
	const races = await scraperFunction();

	await manageScrapedRaces(races, source);
};

async function getAllRaces() {
	return await db.select().from(racesTable).orderBy(desc(racesTable.date));
}

async function manageScrapedRaces(races: TRaceInsert[], source: Sources) {
	await db
		.insert(racesTable)
		.values(races)
		.onConflictDoUpdate({
			target: racesTable.hashedId,
			set: {
				date: sql`excluded.date`,
				location: sql`excluded.location`,
				detailsUrl: sql`excluded.details_url`,
				type: sql`excluded.type`,
			},
		});

	const raceHashes = races.map((race) => race.hashedId);

	await db
		.delete(racesTable)
		.where(
			and(
				eq(racesTable.source, source),
				notInArray(racesTable.hashedId, raceHashes),
			),
		);
}

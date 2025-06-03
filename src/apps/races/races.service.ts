import { Request, Response } from "express";
import { scrapeSIEntries } from "../../lib/scrapers/si-entries/si-entries-scraper.js";
import { db } from "../../db/index.js";
import { racesTable } from "../../db/schema.js";
import { inArray, sql } from "drizzle-orm";

export const getRaces = async (req: Request, res: Response) => {
	const races = await getAllRaces();
	res.status(200);
	return res.json(races);
};

export const scrapeRaces = async (req: Request, res: Response) => {
	const races = await scrapeSIEntries();
	const raceHashedIds = races.map((race) => race.hashedId);

	const existingRaces = await getAllRaces();

	const raceIdsToDelete = existingRaces
		.filter((race) => {
			return !raceHashedIds.includes(race.hashedId);
		})
		.map((race) => race.id);

	await db.delete(racesTable).where(inArray(racesTable.id, raceIdsToDelete));

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

	res.status(201).send();
};

async function getAllRaces() {
	return await db.select().from(racesTable);
}

import { TRaceInsert } from '../../../db/schema.js';
import { Sources } from '../../../enums/Sources.enum.js';
import { baseScraper } from '../base.scraper.js';

export async function scrapeSIEntries(): Promise<TRaceInsert[]> {
	return baseScraper(Sources.SI_ENTRIES);
}

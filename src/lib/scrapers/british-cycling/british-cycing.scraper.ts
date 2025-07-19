import { TRaceInsert } from '../../../db/schema.js';
import { Sources } from '../../../enums/Sources.enum.js';
import { baseScraper } from '../base.scraper.js';

export async function scrapeBritichCycling(): Promise<TRaceInsert[]> {
	return baseScraper(Sources.BRITICH_CYCLING);
}

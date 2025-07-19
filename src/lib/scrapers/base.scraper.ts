import puppeteer, { PuppeteerError } from 'puppeteer';
import {
	BRITISH_CYCLING_MTB_URL,
	SI_ENTRIES_MTB_URL,
} from '../../constants/sourceUrls.js';
import { TRaceInsert } from '../../db/schema.js';
import { Sources } from '../../enums/Sources.enum.js';
import { TRaceRaw } from '../../types/race.type.js';
import { sIEntriesExtractFromDOM } from './si-entries/si-entries.evaluate.js';
import { britishCyclingExtractFromDOM } from './british-cycling/british-cycling.evaluate.js';
import { hashRace } from '../utils/stringToMD5.js';
import { RaceTypes } from '../../enums/RaceTypes.enum.js';
import { siEntriesEventMap } from './si-entries/si-entries-event-map.js';
import { britishCyclingEventMap } from './british-cycling/british-cycling-event-map.js';

const sourceToUrlMap: Record<Sources, string> = {
	[Sources.SI_ENTRIES]: SI_ENTRIES_MTB_URL,
	[Sources.BRITICH_CYCLING]: BRITISH_CYCLING_MTB_URL,
};

const sourceToParserMap: Record<Sources, () => TRaceRaw[]> = {
	[Sources.SI_ENTRIES]: sIEntriesExtractFromDOM,
	[Sources.BRITICH_CYCLING]: britishCyclingExtractFromDOM,
};

const sourceToEventMap: Record<Sources, Record<string, RaceTypes>> = {
	[Sources.SI_ENTRIES]: siEntriesEventMap,
	[Sources.BRITICH_CYCLING]: britishCyclingEventMap,
};

export async function baseScraper(source: Sources): Promise<TRaceInsert[]> {
	const URL = sourceToUrlMap[source];
	let browser;
	try {
		browser = await puppeteer.launch({
			headless: true,
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--disable-dev-shm-usage',
				'--disable-accelerated-2d-canvas',
				'--no-first-run',
				'--no-zygote',
				// '--single-process',
				'--disable-gpu',
			],
		});
		const page = await browser.newPage();

		await page.setUserAgent(
			'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.3',
		);
		await page.goto(URL, {
			waitUntil: 'networkidle0',
			timeout: 60000,
		});

		const parser = sourceToParserMap[source];

		const rawEvents: TRaceRaw[] = await page.evaluate(parser);

		return mapRawEvents(rawEvents, source);
	} catch (e) {
		const error = e as PuppeteerError;
		console.error(`Error during scraping of ${source}: ${error.message}`);
		throw error;
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}

export function mapRawEvents(rawEvents: TRaceRaw[], source: Sources) {
	return rawEvents.flatMap(
		({ titleText, url, dateText, typeText, locationText }) => {
			if (!titleText || !dateText) {
				return [];
			}

			const date = new Date(dateText);

			return [
				{
					name: titleText,
					date: date.toISOString(),
					type: typeText ? mapType(typeText, source) : null,
					location: locationText,
					detailsUrl: url,
					hashedId: hashRace(titleText, date),
					source: source,
				},
			];
		},
	);
}

const mapType = (type: string, source: Sources) => {
	const eventMap = sourceToEventMap[source];
	return eventMap[type as keyof typeof eventMap] || '';
};

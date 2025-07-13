import puppeteer, { PuppeteerError } from 'puppeteer';
import { TRaceInsert } from '../../../db/schema.js';
import { TRaceRaw } from '../../../types/race.type.js';
import { hashRace } from '../../utils/stringToMD5.js';
import { RaceTypes } from '../../../enums/RaceTypes.enum.js';
import { Sources } from '../../../enums/Sources.enum.js';
import { sIEntriesExtractFromDOM } from './si-entries.evaluate.js';
import { SI_ENTRIES_MTB_URL } from '../../../constants/sourceUrls.js';

const siEntriesEventMap = {
	'MTB Enduro': RaceTypes.Enduro,
	'MTB Orienteering': RaceTypes.XC,
	'Mountain Bike': RaceTypes.XC,
};

const mapType = (type: string) => {
	return siEntriesEventMap[type as keyof typeof siEntriesEventMap] || '';
};

export const scrapeSIEntries = async (): Promise<TRaceInsert[]> => {
	const URL = SI_ENTRIES_MTB_URL;
	let browser;
	try {
		browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();

		await page.goto(URL, {
			waitUntil: 'networkidle2',
			timeout: 60000,
		});

		const rawEvents: TRaceRaw[] = await page.evaluate(
			sIEntriesExtractFromDOM,
		);

		return mapRawEvents(rawEvents);
	} catch (e) {
		const error = e as PuppeteerError;
		console.error('Error during scraping:', error.message);
		throw error;
	} finally {
		if (browser) {
			await browser.close();
		}
	}
};

export function mapRawEvents(rawEvents: TRaceRaw[]) {
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
					type: typeText ? mapType(typeText) : null,
					location: locationText,
					detailsUrl: url,
					hashedId: hashRace(titleText, date),
					source: Sources.SI_ENTRIES,
				},
			];
		},
	);
}

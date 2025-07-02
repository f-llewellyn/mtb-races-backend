import { describe, expect, it, MockInstance } from 'vitest';
import path from 'path';
import { RaceTypes } from '../../../../src/enums/RaceTypes.enum.ts';
import { Sources } from '../../../../src/enums/Sources.enum.ts';

import { mapRawEvents } from '../../../../src/lib/scrapers/si-entries/si-entries-scraper.ts';

describe('Unit - SI Entries Scraper', () => {
	let consoleErrorMock: MockInstance;
	beforeEach(() => {
		vi.resetModules();
		consoleErrorMock = vi.spyOn(console, 'error');
	});

	afterEach(async () => {
		consoleErrorMock.mockReset();
	});

	it('Should log and throw error when url cannot be found', async () => {
		vi.doMock('../../../../src/constants/sourceUrls.ts', () => ({
			SI_ENTRIES_MTB_URL: `file://${path.join(__dirname, 'doesnt-exist.html')}`,
		}));

		const { scrapeSIEntries } = await import(
			'../../../../src/lib/scrapers/si-entries/si-entries-scraper.ts'
		);

		await expect(scrapeSIEntries()).rejects.toThrow();

		expect(consoleErrorMock).toHaveBeenCalledWith(
			'Error during scraping:',
			'net::ERR_FILE_NOT_FOUND at file://C:\\Users\\llewe\\Documents\\web\\projects\\mtb-races\\mtb-races-backend\\test\\lib\\scrapers\\si-entries\\doesnt-exist.html',
		);
	});

	it('Should scrape the stub html page', async () => {
		vi.doMock('../../../../src/constants/sourceUrls.ts', () => ({
			SI_ENTRIES_MTB_URL: `file://${path.join(__dirname, 'si-entries.html')}`,
		}));

		const { scrapeSIEntries } = await import(
			'../../../../src/lib/scrapers/si-entries/si-entries-scraper.ts'
		);

		const races = await scrapeSIEntries();

		expect(races).toEqual([
			expect.objectContaining({
				date: '2025-05-31T00:00:00.000Z',
				detailsUrl:
					'https://www.sientries.co.uk/event.php?elid=Y&event_id=15520',
				hashedId: '39e26bfae729eed00124f8e4d17c5fd8',
				location: 'Scotland',
				name: 'Scottish Enduro SeriesR1 - Tweed Valley',
				source: 'Si Entries',
				type: 'Enduro',
			}),
			expect.objectContaining({
				date: '2025-06-01T00:00:00.000Z',
				detailsUrl:
					'https://www.sientries.co.uk/event.php?elid=Y&event_id=14673',
				hashedId: 'a771b701c9c27ffd379f0d52e542fe0b',
				location: 'Yorkshire & Humber',
				name: 'Yorkshire Mountain BikeMarathon',
				source: 'Si Entries',
				type: 'XC',
			}),
			expect.objectContaining({
				date: '2025-03-28T00:00:00.000Z',
				detailsUrl:
					'https://www.sientries.co.uk/event.php?elid=Y&event_id=15402',
				hashedId: 'e02769c5b56981d26ce5a814b4d9960a',
				location: 'Scotland',
				name: 'MacAvalanche',
				source: 'Si Entries',
				type: 'Enduro',
			}),
			expect.objectContaining({
				date: '2025-05-09T00:00:00.000Z',
				detailsUrl:
					'https://www.sientries.co.uk/event.php?elid=Y&event_id=15704',
				hashedId: 'e79e7add4e40eb4c560decc83717992c',
				location: 'North East',
				name: 'Hamsterley BeastFunduro 3',
				source: 'Si Entries',
				type: 'Enduro',
			}),
			expect.objectContaining({
				date: '2025-05-10T00:00:00.000Z',
				detailsUrl:
					'https://www.sientries.co.uk/event.php?elid=Y&event_id=15705',
				hashedId: 'e5af3f71372995ef5c13ebed645a897b',
				location: 'North East',
				name: 'Hammers Jam',
				source: 'Si Entries',
				type: 'XC',
			}),
			expect.objectContaining({
				date: '2025-05-16T00:00:00.000Z',
				detailsUrl:
					'https://www.sientries.co.uk/event.php?elid=Y&event_id=15602',
				hashedId: '5dae0fb0da8ad14ca276bdcee310559b',
				location: 'Yorkshire & Humber',
				name: 'Boltby Bash Enduro',
				source: 'Si Entries',
				type: 'Enduro',
			}),
		]);
	});

	it('Should process raw races and return all with a title and date field in a formatted structure', async () => {
		const rawRaces = [
			{
				dateText: 'Sat 31 May 2025',
				locationText: 'Scotland',
				titleText: 'Race 1',
				typeText: 'Mountain Bike',
				url: 'https://www.sientries.co.uk/event.php?elid=Y&event_id=15520',
			},
			{
				dateText: '',
				locationText: 'Scotland',
				titleText: 'Race 2',
				typeText: null,
				url: 'https://www.sientries.co.uk/event.php?elid=Y&event_id=15520',
			},
			{
				dateText: 'Tue 2 July 2025',
				locationText: 'Scotland',
				titleText: '',
				typeText: null,
				url: 'https://www.sientries.co.uk/event.php?elid=Y&event_id=15520',
			},
			{
				dateText: 'Thu 4 July 2025',
				locationText: null,
				titleText: 'Race 4',
				typeText: 'MTB Enduro',
				url: null,
			},
		];

		const formattedResults = mapRawEvents(rawRaces);

		expect(formattedResults).toEqual([
			expect.objectContaining({
				date: '2025-05-31T00:00:00.000Z',
				detailsUrl:
					'https://www.sientries.co.uk/event.php?elid=Y&event_id=15520',
				hashedId: '9bdfe6ae081d454a2a10e59940d65e9a',
				location: 'Scotland',
				name: 'Race 1',
				type: RaceTypes.XC,
				source: Sources.SI_ENTRIES,
			}),
			expect.objectContaining({
				date: '2025-07-04T00:00:00.000Z',
				detailsUrl: null,
				hashedId: 'ae10d8dc454c103305f8607deb90e956',
				location: null,
				name: 'Race 4',
				type: RaceTypes.Enduro,
				source: Sources.SI_ENTRIES,
			}),
		]);
	});
});

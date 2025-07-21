import { describe, expect, it, MockInstance } from 'vitest';
import path from 'path';

describe('Unit - British Cycling Scraper', () => {
	let consoleErrorMock: MockInstance;
	beforeEach(() => {
		vi.resetModules();
		consoleErrorMock = vi.spyOn(console, 'error');
	});

	afterEach(async () => {
		consoleErrorMock.mockReset();
	});

	it('Should log and throw error when url cannot be found', async () => {
		vi.doMock('../../../../src/constants/sourceUrls.js', () => ({
			BRITISH_CYCLING_MTB_URL: `file://${path.join(__dirname, 'doesnt-exist.html')}`,
			SI_ENTRIES_MTB_URL: '',
		}));

		const { scrapeBritichCycling } = await import(
			'../../../../src/lib/scrapers/british-cycling/british-cycling.scraper.js'
		);

		await expect(scrapeBritichCycling()).rejects.toThrow();

		expect(consoleErrorMock).toHaveBeenCalledWith(
			'Error during scraping of British Cycling:',
			`net::ERR_FILE_NOT_FOUND at file://${path.join(__dirname, 'doesnt-exist.html')}`,
		);
	});

	it('Should scrape the stub html page', async () => {
		vi.doMock('../../../../src/constants/sourceUrls.js', () => ({
			BRITISH_CYCLING_MTB_URL: `file://${path.join(__dirname, 'british-cycling.html')}`,
			SI_ENTRIES_MTB_URL: '',
		}));

		const { scrapeBritichCycling } = await import(
			'../../../../src/lib/scrapers/british-cycling/british-cycling.scraper.js'
		);

		const races = await scrapeBritichCycling();

		expect(races).toEqual([
			expect.objectContaining({
				date: '2025-07-18T00:00:00.000Z',
				detailsUrl:
					'https://www.britishcycling.org.uk/events/details/313236/Lloyds-2025-National-MTB-Cross-Country-Championships#results',
				hashedId: 'e4778b3f89aef60caaddfb7503ccc758',
				location: "Woody's Bike Park, Cornwall",
				name: 'Lloyds 2025 National MTB Cross Country Championships',
				source: 'British Cycling',
				type: 'XC',
			}),
			expect.objectContaining({
				date: '2025-07-19T00:00:00.000Z',
				detailsUrl:
					'https://www.britishcycling.org.uk/events/details/313220/Lloyds-National-Downhill-Championships-2025',
				hashedId: '690b3b1ced38f1ebcbfca75f23c72313',
				location: 'Fort William, Inverness-shire',
				name: 'Lloyds National Downhill Championships 2025',
				source: 'British Cycling',
				type: 'Downhill',
			}),
			expect.objectContaining({
				date: '2025-07-19T00:00:00.000Z',
				detailsUrl:
					'https://www.britishcycling.org.uk/events/details/314602/Schwalbe-British-4X-Series-Round-5',
				hashedId: 'e958ab022234e921a106678f747d12ff',
				location: 'Shredhill, Gloucestershire',
				name: 'Schwalbe British 4X Series Round 5',
				source: 'British Cycling',
				type: '4X',
			}),
			expect.objectContaining({
				date: '2025-07-19T00:00:00.000Z',
				detailsUrl:
					'https://www.britishcycling.org.uk/events/details/321412/Bedgebury-Forest-CC---2025-XC-Race-Series---Event-3',
				hashedId: '7cff115f05a5d039f1a105696d3fa39e',
				location: 'Bedgebury Forest, Kent',
				name: 'Bedgebury Forest CC - 2025 XC Race Series - Event 3 (Cancelled)',
				source: 'British Cycling',
				type: 'XC',
			}),
		]);
	});
});

import { MockInstance } from 'vitest';
import PgBoss from 'pg-boss';
import { DB, getDB } from '../../../src/db/index.js';
import { racesTable } from '../../../src/db/schema.js';
import { config } from '../../../src/config.js';
import { SI_SCRAPE_QUEUE } from '../../../src/constants/queueNames.js';
import * as siEntriesScraperModule from '../../../src/lib/scrapers/si-entries/si-entries-scraper.js';
import { RaceTypes } from '../../../src/enums/RaceTypes.enum.js';
import { Sources } from '../../../src/enums/Sources.enum.js';
import { scrapeSiEntriesProcess } from '../../../src/apps/races/races.processor.js';

describe('E2E - Races Processor', async () => {
	const originalFetch = globalThis.fetch;
	const testId = '1A2B3C';
	let db: DB;
	let scrapeSIEntriesMock: MockInstance;
	let consoleErrorSpy: MockInstance;
	let fetchMock: typeof fetch;

	beforeEach(async () => {
		db = await getDB();

		scrapeSIEntriesMock = vi.spyOn(
			siEntriesScraperModule,
			'scrapeSIEntries',
		);

		consoleErrorSpy = vi.spyOn(console, 'error');

		// fetchMock = vi.fn().mockResolvedValue({ ok: true });
		// globalThis.fetch = fetchMock;
	});

	afterEach(async () => {
		await db.delete(racesTable);
		globalThis.fetch = originalFetch;
		vi.resetAllMocks();
	});

	it('Should schedule si entries scrape on startup', async () => {
		const boss = new PgBoss(config.DATABASE_URL!);
		await boss.start();

		const schedules = await boss.getSchedules();
		const siSchedule = schedules.find(
			(schedule) => (schedule.name = SI_SCRAPE_QUEUE),
		);
		expect(siSchedule).toBeDefined();
		expect(siSchedule).toEqual(
			expect.objectContaining({
				name: SI_SCRAPE_QUEUE,
				cron: '0 0 * * 1',
			}),
		);

		await boss.clearStorage();
		boss.stop({ graceful: false });
	});

	it('Should log error and cancel execution when error is thrown ', async () => {
		scrapeSIEntriesMock.mockImplementation(async () => {
			throw new Error('Test error');
		});

		const initialRaces = await db.select().from(racesTable);
		expect(initialRaces).toHaveLength(0);

		await scrapeSiEntriesProcess(testId);

		const newRaces = await db.select().from(racesTable);

		expect(newRaces).toEqual([]);

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			`Job ${testId} failed`,
			Error('Test error'),
		);
	});

	it('Should log error when tag revalidate fails ', async () => {
		scrapeSIEntriesMock.mockImplementation(async () => {
			return Promise.resolve([
				{
					name: 'Race 1',
					date: '2004-01-30',
					hashedId: '39e8836d7bd1cb0c46a70f0f1f6d6016',
					location: 'Chesterfield',
					detailsUrl: 'https://races.com/race1',
					type: RaceTypes.XC,
					source: Sources.SI_ENTRIES,
				},
				{
					name: 'Race 2',
					date: '2002-02-02',
					hashedId: '516d5f5393ffb53c12f058b9cdca7dd0',
					location: 'Chesterfield',
					detailsUrl: 'https://races.com/race2',
					type: RaceTypes.Enduro,
					source: Sources.SI_ENTRIES,
				},
			]);
		});

		const error = new Error('Netwrok Error');
		fetchMock = vi.fn().mockImplementation(async () => {
			throw error;
		});
		globalThis.fetch = fetchMock;

		await scrapeSiEntriesProcess(testId);

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Error while revalidating tag: races',
			error,
		);
	});

	it('Should scrape races and insert into races table ', async () => {
		scrapeSIEntriesMock.mockImplementation(async () => {
			return Promise.resolve([
				{
					name: 'Race 1',
					date: '2004-01-30',
					hashedId: '39e8836d7bd1cb0c46a70f0f1f6d6016',
					location: 'Chesterfield',
					detailsUrl: 'https://races.com/race1',
					type: RaceTypes.XC,
					source: Sources.SI_ENTRIES,
				},
				{
					name: 'Race 2',
					date: '2002-02-02',
					hashedId: '516d5f5393ffb53c12f058b9cdca7dd0',
					location: 'Chesterfield',
					detailsUrl: 'https://races.com/race2',
					type: RaceTypes.Enduro,
					source: Sources.SI_ENTRIES,
				},
			]);
		});

		const initialRaces = await db.select().from(racesTable);
		expect(initialRaces).toHaveLength(0);

		await scrapeSiEntriesProcess(testId);

		const newRaces = await db.select().from(racesTable);

		expect(newRaces).toEqual([
			expect.objectContaining({
				name: 'Race 1',
				date: '2004-01-30',
				hashedId: '39e8836d7bd1cb0c46a70f0f1f6d6016',
				location: 'Chesterfield',
				detailsUrl: 'https://races.com/race1',
				type: RaceTypes.XC,
				source: Sources.SI_ENTRIES,
			}),
			expect.objectContaining({
				name: 'Race 2',
				date: '2002-02-02',
				hashedId: '516d5f5393ffb53c12f058b9cdca7dd0',
				location: 'Chesterfield',
				detailsUrl: 'https://races.com/race2',
				type: RaceTypes.Enduro,
				source: Sources.SI_ENTRIES,
			}),
		]);
	});

	it('Should scrape siEntries and update existing races in db', async () => {
		await db.insert(racesTable).values([
			{
				name: 'Race 1',
				date: '2004-01-30',
				hashedId: '39e8836d7bd1cb0c46a70f0f1f6d6016',
				location: 'Chesterfield',
				detailsUrl: 'https://races.com/race1',
				type: RaceTypes.Enduro,
				source: Sources.SI_ENTRIES,
			},
		]);

		scrapeSIEntriesMock.mockImplementation(async () => {
			return Promise.resolve([
				{
					name: 'Race 1',
					date: '2026-01-30',
					hashedId: '39e8836d7bd1cb0c46a70f0f1f6d6016',
					location: 'High Wycombe',
					detailsUrl: 'https://races.com/race1#new',
					type: RaceTypes.Enduro,
					source: Sources.SI_ENTRIES,
				},
			]);
		});

		await scrapeSiEntriesProcess(testId);

		const newRecords = await db.select().from(racesTable);

		expect(newRecords).toEqual([
			expect.objectContaining({
				name: 'Race 1',
				date: '2026-01-30',
				hashedId: '39e8836d7bd1cb0c46a70f0f1f6d6016',
				location: 'High Wycombe',
				detailsUrl: 'https://races.com/race1#new',
				type: RaceTypes.Enduro,
				source: Sources.SI_ENTRIES,
			}),
		]);
	});

	it('Should scrape siEntries and delete races that are no longer present from db', async () => {
		await db.insert(racesTable).values([
			{
				name: 'Race 1',
				date: '2004-01-30',
				hashedId: '39e8836d7bd1cb0c46a70f0f1f6d6016',
				location: 'Chesterfield',
				detailsUrl: 'https://races.com/race1',
				type: RaceTypes.Enduro,
				source: Sources.SI_ENTRIES,
			},
		]);

		scrapeSIEntriesMock.mockImplementation(async () => {
			return Promise.resolve([
				{
					name: 'Race 2',
					date: '2026-01-30',
					hashedId: 'hashedId2',
					location: 'High Wycombe',
					detailsUrl: 'https://races.com/race1#new',
					type: RaceTypes.Enduro,
					source: Sources.SI_ENTRIES,
				},
			]);
		});

		await scrapeSiEntriesProcess(testId);

		const newRecords = await db.select().from(racesTable);

		expect(newRecords).toEqual([
			expect.objectContaining({
				name: 'Race 2',
				date: '2026-01-30',
				hashedId: 'hashedId2',
				location: 'High Wycombe',
				detailsUrl: 'https://races.com/race1#new',
				type: RaceTypes.Enduro,
				source: Sources.SI_ENTRIES,
			}),
		]);
	});
});

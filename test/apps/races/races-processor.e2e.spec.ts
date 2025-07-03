import { MockInstance } from 'vitest';
import PgBoss from 'pg-boss';
import { db } from '../../../src/db/index.ts';
import { racesTable } from '../../../src/db/schema.ts';
import { config } from '../../../src/config.ts';
import { SI_SCRAPE_QUEUE } from '../../../src/constants/queueNames.ts';
import { createApp } from '../../../src/lib/utils/createApp.ts';
import { waitForJobStatus } from '../../../src/lib/utils/test-helpers/wait-for-job-status.ts';
import * as siEntriesScraperModule from '../../../src/lib/scrapers/si-entries/si-entries-scraper.ts';
import { RaceTypes } from '../../../src/enums/RaceTypes.enum.ts';
import { Sources } from '../../../src/enums/Sources.enum.ts';

describe('E2E - Races Processor', async () => {
	await createApp();
	let boss: PgBoss;
	let scrapeSIEntriesMock: MockInstance;
	let consoleErrorSpy: MockInstance;

	beforeEach(async () => {
		boss = new PgBoss(config.DATABASE_URL!);
		await boss.start();

		scrapeSIEntriesMock = vi.spyOn(
			siEntriesScraperModule,
			'scrapeSIEntries',
		);

		consoleErrorSpy = vi.spyOn(console, 'error');
	});

	afterEach(async () => {
		await boss.clearStorage();
		boss.stop({ graceful: false });
		await db.delete(racesTable);
		scrapeSIEntriesMock.mockReset();
		consoleErrorSpy.mockReset();
	});

	it('Should schedule si entries scrape on startup', async () => {
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
	});

	// it('Should log error and cancel execution when error is thrown ', async () => {
	// 	scrapeSIEntriesMock.mockImplementation(async () => {
	// 		throw new Error('Test error');
	// 	});

	// 	const initialRaces = await db.select().from(racesTable);
	// 	expect(initialRaces).toHaveLength(0);

	// 	const jobId = await boss.send(SI_SCRAPE_QUEUE, {});

	// 	await waitForJobStatus(boss, SI_SCRAPE_QUEUE, jobId, 'failed');

	// 	const newRaces = await db.select().from(racesTable);

	// 	expect(newRaces).toEqual([]);

	// 	expect(consoleErrorSpy).toHaveBeenCalledWith(
	// 		`Job ${jobId} failed`,
	// 		Error('Test error'),
	// 	);
	// });

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

		const jobId = await boss.send(SI_SCRAPE_QUEUE, {});

		await waitForJobStatus(boss, SI_SCRAPE_QUEUE, jobId, 'completed');

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

		const jobId = await boss.send(SI_SCRAPE_QUEUE, {});

		await waitForJobStatus(boss, SI_SCRAPE_QUEUE, jobId, 'completed');

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
});

import request from 'supertest';
import { Express } from 'express';
import { DB, getDB } from '../../../src/db/index.ts';
import { racesTable } from '../../../src/db/schema.ts';
import { createApp } from '../../../src/lib/utils/createApp.ts';

describe('E2E - GET Races', () => {
	let app: Express;
	let db: DB;

	beforeEach(async () => {
		db = await getDB();
		app = await createApp();
	});

	afterEach(async () => {
		await db.delete(racesTable);
	});

	describe('GET /api/races', () => {
		it('Returns 200 and an empty array when no races are stored', async () => {
			const { body } = await request(app).get('/api/races').expect(200);

			expect(body).toEqual([]);
		});

		it('Returns 200 and an array of saved events', async () => {
			await db.insert(racesTable).values([
				{
					name: 'Race 1',
					date: '2004-01-30',
					hashedId: 'hashedid1',
					location: 'Chesterfield',
					detailsUrl: 'https://races.com/race1',
				},
				{
					name: 'Race 2',
					date: '2002-02-02',
					hashedId: 'hashedid2',
					location: 'Chesterfield',
					detailsUrl: 'https://races.com/race2',
				},
			]);

			const { body } = await request(app).get('/api/races').expect(200);

			expect(body).toEqual([
				expect.objectContaining({
					name: 'Race 1',
					date: '2004-01-30',
					hashedId: 'hashedid1',
					location: 'Chesterfield',
					detailsUrl: 'https://races.com/race1',
				}),
				expect.objectContaining({
					name: 'Race 2',
					date: '2002-02-02',
					hashedId: 'hashedid2',
					location: 'Chesterfield',
					detailsUrl: 'https://races.com/race2',
				}),
			]);
		});
	});
});

import request from 'supertest';
import PgBoss from 'pg-boss';
import { Express } from 'express';
import { config } from '../../../src/config.js';
import { createApp } from '../../../src/lib/utils/createApp.js';
import { SI_SCRAPE_QUEUE } from '../../../src/constants/queueNames.js';

describe('E2E - POST Races', () => {
	let app: Express;
	let boss: PgBoss;
	const apiKey = config.API_KEY;

	beforeEach(async () => {
		app = await createApp();
		boss = new PgBoss(config.DATABASE_URL!);
		await boss.start();
	});

	afterEach(async () => {
		await boss.clearStorage();
		boss.stop({ graceful: false });
	});

	describe('POST /api/races/scrape/si-entries', () => {
		it('Should return 401 when no api key is given', async () => {
			await request(app)
				.post('/api/races/scrape/si-entries')
				.expect(401)
				.expect({ error: 'API key required' });
		});

		it('Should return 401 when incorrect api key is given', async () => {
			await request(app)
				.post('/api/races/scrape/si-entries')
				.set({ 'x-api-key': 'testKey' })
				.expect(401)
				.expect({ error: 'Invalid API key' });
		});

		it('Should queue si entries scrape job', async () => {
			await request(app)
				.post('/api/races/scrape/si-entries')
				.set({ 'x-api-key': apiKey })
				.expect(201);

			const jobs = await boss.fetch(SI_SCRAPE_QUEUE);

			expect(jobs).toHaveLength(1);
		});
	});
});

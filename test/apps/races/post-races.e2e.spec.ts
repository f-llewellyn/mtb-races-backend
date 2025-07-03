import request from 'supertest';
import PgBoss from 'pg-boss';
import { Express } from 'express';
import { config } from '../../../src/config.ts';
import { createApp } from '../../../src/lib/utils/createApp.ts';
import { SI_SCRAPE_QUEUE } from '../../../src/constants/queueNames.ts';

describe('E2E - POST Races', () => {
	let app: Express;
	let boss: PgBoss;
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
		it('Should queue si entries scrape job', async () => {
			await request(app).post('/api/races/scrape/si-entries').expect(201);

			const jobs = await boss.fetch(SI_SCRAPE_QUEUE);

			expect(jobs).toHaveLength(1);
		});
	});
});

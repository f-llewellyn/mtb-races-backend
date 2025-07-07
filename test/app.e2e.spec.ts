import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../src/lib/utils/createApp.ts';

describe('E2E - App default routes', () => {
	let app: Express;
	beforeEach(async () => {
		app = await createApp();
	});

	it('Returns 200 and default message when hitting root', async () => {
		const { text } = await request(app).get('/').expect(200);

		expect(text).toEqual('Hello World');
	});

	it('Returns 200 when hitting /health', async () => {
		await request(app).get('/health').expect(200);
	});
});

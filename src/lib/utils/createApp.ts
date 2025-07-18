import express, { Express } from 'express';
import apiRouter from '../../router.js';
import { getBoss } from '../../pgboss/index.js';
import { getDB } from '../../db/index.js';

export async function createApp(): Promise<Express> {
	await getBoss();
	await getDB();
	const app = express();

	app.get('/', (_, res) => {
		res.send('Hello World');
	});

	app.get('/health', (_, res) => {
		res.send();
	});

	app.use('/api', apiRouter);

	return app;
}

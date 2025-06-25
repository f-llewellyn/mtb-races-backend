import express, { Express } from 'express';
import apiRouter from '../../router.ts';
import { startPGBoss } from '../queues/queues.ts';
import { initDb } from '../../db/index.ts';

export async function createApp(): Promise<Express> {
	await startPGBoss();
	initDb();
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

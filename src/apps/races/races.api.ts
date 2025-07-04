import { Router } from 'express';
import { getRaces } from './races.service.ts';
import { sendJob } from '../../lib/queues/queues.ts';
import { SI_SCRAPE_QUEUE } from '../../constants/queueNames.ts';

const racesRouter = Router();

racesRouter.get('/', async (req, res) => {
	const races = await getRaces();
	res.status(200);
	return res.json(races);
});

racesRouter.post('/scrape/si-entries', async (req, res) => {
	await sendJob(SI_SCRAPE_QUEUE, {});
	return res.status(201).send();
});

export default racesRouter;

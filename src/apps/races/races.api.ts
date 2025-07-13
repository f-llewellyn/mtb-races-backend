import { Router } from 'express';
import { getRaces } from './races.service.js';
import { sendJob } from '../../pgboss/index.js';
import { SI_SCRAPE_QUEUE } from '../../constants/queueNames.js';
import { apiKeyGuard } from '../../lib/guards/apiKey.guard.js';

const racesRouter = Router();

racesRouter.use(apiKeyGuard);

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

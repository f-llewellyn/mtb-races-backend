import { Router } from 'express';
import { getRaces, scrapeRaces } from './races.service.ts';

const racesRouter = Router();

racesRouter.get('/', async (req, res) => {
	const races = await getRaces();
	res.status(200);
	return res.json(races);
});

racesRouter.post('/scrape/si-entries', async (req, res) => {
	await scrapeRaces();
	return res.status(201).send();
});

export default racesRouter;

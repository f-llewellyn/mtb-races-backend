import { Router } from 'express';
import { getRaces } from './races.service.js';

const racesRouter = Router();

racesRouter.get('/', async (req, res) => {
	const races = await getRaces();
	res.status(200);
	return res.json(races);
});

export default racesRouter;

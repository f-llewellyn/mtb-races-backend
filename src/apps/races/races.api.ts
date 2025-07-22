import { Request, Response, Router } from 'express';
import { getRaces } from './races.service.js';
import { sendJob } from '../../pgboss/index.js';
import {
	BC_SCRAPE_QUEUE,
	SI_SCRAPE_QUEUE,
} from '../../constants/queueNames.js';
import { apiKeyGuard } from '../../lib/guards/apiKey.guard.js';
import { validateQuery } from '../../lib/middleware/validate-query.js';
import {
	RaceQuerySchema,
	TRaceQueryParams,
} from './schemas/race-query.schema.js';

const racesRouter = Router();

racesRouter.use(apiKeyGuard);

racesRouter.get(
	'/',
	validateQuery(RaceQuerySchema),
	async (
		req: Request<object, unknown, unknown, TRaceQueryParams>,
		res: Response,
	) => {
		const { from } = req.query;
		const races = await getRaces(from);
		res.status(200);
		return res.json(races);
	},
);

racesRouter.post('/scrape/si-entries', async (req, res) => {
	await sendJob(SI_SCRAPE_QUEUE, {});
	return res.status(201).send();
});

racesRouter.post('/scrape/british-cycling', async (req, res) => {
	await sendJob(BC_SCRAPE_QUEUE, {});
	return res.status(201).send();
});

export default racesRouter;

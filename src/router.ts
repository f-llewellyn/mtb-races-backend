import { Router } from 'express';
import racesRouter from './apps/races/races.api.ts';

const router = Router();

router.use('/races', racesRouter);

export default router;

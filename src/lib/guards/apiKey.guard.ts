import { Request, Response, NextFunction } from 'express';
import { config } from '../../config.ts';

export function apiKeyGuard(req: Request, res: Response, next: NextFunction) {
	const reqApiKey = req.headers['x-api-key'];

	if (!reqApiKey) {
		return res.status(401).json({ error: 'API key required' });
	}

	if (reqApiKey !== config.API_KEY) {
		return res.status(401).json({ error: 'Invalid API key' });
	}

	next();
}

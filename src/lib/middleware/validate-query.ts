import { NextFunction, Request, Response } from 'express';
import z from 'zod';

export function validateQuery<T>(schema: z.ZodSchema<T>) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.query);
			next();
		} catch (error) {
			return res
				.status(400)
				.json({ message: 'Invalid query parameters', error: error });
		}
	};
}

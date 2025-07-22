import z from 'zod';

export const RaceQuerySchema = z.object({
	from: z.string().datetime(),
});

export type TRaceQueryParams = z.infer<typeof RaceQuerySchema>;

import { z } from 'zod';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
process.loadEnvFile(envFile);

const configSchema = z.object({
	DATABASE_URL: z.string(),
	FRONTEND_BASE_URL: z.string().url(),
	PORT: z.string().nullable(),
});

export const config = configSchema.parse(process.env);

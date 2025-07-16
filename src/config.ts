import { z } from 'zod';

const nodeEnv = process.env.NODE_ENV
const envFile = nodeEnv  === 'test' ? '.env.test' : '.env';

if (nodeEnv !== 'production') {
	process.loadEnvFile(envFile);
}

const configSchema = z.object({
	DATABASE_URL: z.string(),
	FRONTEND_BASE_URL: z.string().url(),
	PORT: z.string().nullable(),
	API_KEY: z.string(),
});

export const config = configSchema.parse(process.env);

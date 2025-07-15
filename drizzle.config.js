import { defineConfig } from 'drizzle-kit';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
	out: './drizzle',
	schema: isProduction ? './dist/db/schema.js' : './src/db/schema.ts',
	dialect: 'postgresql',
	casing: 'snake_case',
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
});

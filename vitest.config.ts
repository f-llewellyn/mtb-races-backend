import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globalSetup: ['./test/setup.ts'],
		environment: 'node',
		globals: true,
		testTimeout: 10000,
		poolOptions: {
			threads: {
				singleThread: true,
			},
		},
		coverage: {
			thresholds: {
				lines: 100,
			},
			reporter: ['text', 'json-summary', 'json'],
			reportOnFailure: true,
			exclude: [
				'src/index.ts',
				'node_modules',
				'dist',
				'test',
				'**/*.{config,type,evaluate}.{js,mjs,cjs,ts,mts,cts}',
			],
		},
	},
});

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
			reportOnFailure: true,
		},
	},
});

import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globalSetup: ["./test/setup.ts"],
		environment: "node",
		globals: true,
		// testTimeout: 60000,
	},
});

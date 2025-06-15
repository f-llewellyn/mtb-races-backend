import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettierReccomended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		languageOptions: { globals: globals.browser },
	},
	tseslint.configs.recommended,
	eslintPluginPrettierReccomended,
]);

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import { fixupConfigRules } from '@eslint/compat';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import security from 'eslint-plugin-security';
import globals from 'globals';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { fixupPluginRules } from '@eslint/compat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const files = [
	'**/*.ts',
	'**/*.tsx',
	'**/**/*.ts',
	'**/**/*.tsx',
	'**/**/**/*.ts',
	'**/**/**/*.tsx',
];

const eslintConfig = [
	...fixupConfigRules(
		compat.extends(
			'next/core-web-vitals',
			'next/typescript',
			'plugin:@typescript-eslint/eslint-recommended',
			'plugin:@typescript-eslint/recommended',
			'plugin:import/typescript',
			'prettier',
		),
	).map((config) => ({ ...config, files })),
	{
		ignores: ['node_modules', 'coverage', 'dist'],
	},
	{
		files,
		plugins: {
			'@typescript-eslint': fixupPluginRules(typescriptEslint),
			security: security.configs.recommended,
			prettier,
			importPlugin: importPlugin.flatConfigs.recommended,
			importTypescript: importPlugin.flatConfigs.typescript,
		},

		languageOptions: {
			globals: {
				...globals.browser,
				Atomics: 'readonly',
				SharedArrayBuffer: 'readonly',
			},
			parser: tsParser,
			ecmaVersion: 5,
			sourceType: 'script',
			parserOptions: {
				project: './tsconfig.json',
			},
		},

		settings: {
			'import/resolver': {
				...importPlugin.configs.typescript.settings['import/resolver'],
				typescript: {
					alwaysTryTypes: true,
					project: './tsconfig.json',
				},
			},
		},

		rules: {
			'import/extensions': [
				'error',
				'ignorePackages',
				{
					ts: 'never',
					tsx: 'never',
					css: 'always',
				},
			],
			'no-restricted-imports': [
				'error',
				{
					patterns: ['.*', '!*.css'],
				},
			],
			'import/order': [
				'error',
				{
					'newlines-between': 'never',
					pathGroups: [
						{
							pattern: '@/lib/**',
							group: 'external',
							position: 'after',
						},

						{
							pattern: './**',
							group: 'external',
							position: 'after',
						},
					],
					distinctGroup: false,
				},
			],
			'prettier/prettier': 'error',
		},
	},
];

export default eslintConfig;

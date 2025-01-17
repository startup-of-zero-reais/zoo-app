import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { fixupConfigRules } from 'eslint/compat'
import { importPlugin } from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier'
import security from 'eslint-plugin-security'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const files = ['**/*.ts', '**/*.tsx', '**/**/*.ts', '**/**/*.tsx', '**/**/**/*.ts', '**/**/**/*.tsx']

const eslintConfig = [
	...fixupConfigRules(compat.extends(
		"next/core-web-vitals",
		"next/typescript",
		"prettier",
	)).map(config => ({ ...config, files })),
	{
		ignores: [
			'node_modules',
			'coverage',
			'dist',
		]
	},
	{
		files,
		plugins: {
			security: security.configs.recommended,
			prettier,
			importPlugin: importPlugin.flatConfigs.recommended,
			importTypescript: importPlugin.flatConfigs.typescript,
		},

		languageOptions: {},

		settings: {
			'import/resolver': {
				...importPlugin.configs.typescript.settings['import/resolver'],
				typescript: {
					project: './tsconfig.json'
				},

				node: {
					extensions: ['.ts']
				},

				react: {
					extensions: ['.tsx']
				}
			}
		},

		rules: {
			'import/extensions': ['error', 'ignorePackages', {
				ts: 'never',
				tsx: 'never'
			}],
			'no-restricted-imports': ['error', {
				'newlines-between': 'never',
				pathGroups: [
					{
						pattern: '@/lib/**',
						group: 'external',
						position: 'after'
					}
				],
				distinctGroup: false,
			}],
			'prettier/prettier': 'error',
		}
	}
];

export default eslintConfig;

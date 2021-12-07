module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier'],
	env: {
		node: true,
	},
	extends: [
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
	],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',
		'prettier/prettier': [
			'warn',
			{
				endOfLine: 'auto',
				singleQuote: true,
				semi: false,
				printWidth: 80,
				tabWidth: 2,
				useTabs: true,
			},
		],
	},
	ignorePatterns: ['node_modules', 'dist', 'docs'],
}

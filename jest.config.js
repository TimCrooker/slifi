/* eslint-disable @typescript-eslint/no-var-requires */
const hq = require('alias-hq')

module.exports = {
	verbose: true,
	testEnvironment: 'node',
	modulePathIgnorePatterns: ['dist'],
	moduleNameMapper: hq.get('jest'),
}

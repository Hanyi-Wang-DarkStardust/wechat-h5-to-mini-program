/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '(/test/.*\\.test\\.ts)$',
  coverageProvider: 'v8',
  globals: {
    'ts-jest': {
      tsconfig: './test/tsconfig.json'
    }
  }
}

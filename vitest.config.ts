import { defineWorkspace } from 'vitest/config'

const sharedCoverage = {
  reporter: ['text', 'html', 'lcov', 'json-summary', 'json'],
  exclude: [
    'node_modules/',
    'dist/',
    'test/',
    '**/*.d.ts',
    'packages/**/rollup.config.js',
    'vitest.config.ts',
  ],
}

const sharedTestOptions = {
  globals: true,
  environment: 'node',
}

export default defineWorkspace([
  {
    test: {
      ...sharedTestOptions,
      name: 'core',
      root: './packages/core',
      include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['node_modules', 'dist'],
      typecheck: {
        enabled: true,
        tsconfig: './packages/core/tsconfig.json',
      },
      coverage: {
        ...sharedCoverage,
        reportsDirectory: './coverage',
      },
    },
    resolve: {
      alias: {
        '@good-typescript-libraries/core': new URL('./packages/core/src', import.meta.url).pathname,
      },
    },
  },
])

import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

// Tests exercise pure logic (data loaders, search, data integrity) — no DOM —
// so the fast default 'node' environment is used. The @data alias mirrors the
// app so tests import the same content JSON the app does.
export default defineConfig({
  resolve: {
    alias: {
      '@data': resolve(import.meta.dirname, '..', 'data'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})

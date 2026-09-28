import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { sitePages } from './scripts/site-pages.ts'

// Study content lives in ../data (repo root), outside the web/ app. The alias
// and fs.allow entry let the app import that content as typed JSON at build time.
const dataDir = resolve(import.meta.dirname, '..', 'data')

// The repo name is used as the base path when hosting on GitHub Pages
// (served from https://<user>.github.io/bns-study-platform/).
// In dev, base is '/' so local URLs stay simple.
const BASE = '/bns-study-platform/'
const SITE_URL = `https://pskprem.github.io${BASE}`

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // `vite preview` serves the built dist/, so it needs the production base too.
  base: command === 'build' || isPreview ? BASE : '/',
  plugins: [
    react(),
    tailwindcss(),
    // Per-route HTML pages (200 + real titles), sitemap.xml, 404 shell and the
    // offline service worker. See scripts/site-pages.ts.
    sitePages({ siteUrl: SITE_URL, dataDir }),
  ],
  resolve: {
    alias: {
      '@data': dataDir,
    },
  },
  server: {
    fs: {
      // Allow Vite's dev server to read the content folder outside web/.
      allow: ['..'],
    },
  },
}))

import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

// GitHub Pages serves static files, so a hard refresh on a client-side route
// (e.g. /chapter/ch-02) would 404. Copying index.html to 404.html makes Pages
// serve the SPA shell for any unknown path, letting React Router handle it.
function spaFallback(): Plugin {
  return {
    name: 'spa-404-fallback',
    closeBundle() {
      const dist = resolve(import.meta.dirname, 'dist')
      copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
    },
  }
}

// The repo name is used as the base path when hosting on GitHub Pages
// (served from https://<user>.github.io/bns-study-platform/).
// In dev, base is '/' so local URLs stay simple.
// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/bns-study-platform/' : '/',
  plugins: [react(), tailwindcss(), spaFallback()],
}))

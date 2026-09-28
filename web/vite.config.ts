import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The repo name is used as the base path when hosting on GitHub Pages
// (served from https://<user>.github.io/bns-study-platform/).
// In dev, base is '/' so local URLs stay simple.
// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/bns-study-platform/' : '/',
  plugins: [react(), tailwindcss()],
}))

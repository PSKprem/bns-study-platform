# Tech Stack & Performance Standards

## Stack (do not add heavyweight alternatives without a documented reason)

- **React + Vite + TypeScript** — app framework and build tool.
- **Tailwind CSS v4** (`@tailwindcss/vite`) — styling.
- **React Router** — client-side routing (`basename` = Vite `BASE_URL` for GitHub Pages).
- **Fuse.js** — client-side fuzzy search.
- **Markmap** (`markmap-lib` + `markmap-view`) — clickable mind maps.
- **localStorage** — on-device study progress (read sections, best MCQ scores, last page)
  and theme. No backend, no database, no accounts.
- **Build-time pages + service worker** — `web/scripts/site-pages.ts` writes an HTML page
  per route (real titles, HTTP 200), `sitemap.xml`, and `sw.js` for offline use.
- **GitHub Pages** — free static hosting; deploy via GitHub Actions on push to `main`.

## Architecture constraints

- **Static-first.** Everything compiles to static files; no server-side code.
- **Content is data.** Study content lives in `data/*.json`, loaded by the app — never
  hard-coded into components.
- **No new runtime dependency** unless it earns its place; prefer the standard library and
  small, well-maintained packages. Pin sensible versions.

## Performance standards

- **Split content per chapter** (small JSON files) so pages load only what they need.
- **Code-split by route** so the initial bundle stays small.
- Keep the initial JS payload lean; lazy-load heavy features (e.g., mind map) where possible.
- Images/assets optimised; no large unused assets shipped.
- Target fast loads on a typical mobile connection (a stated requirement).

## Accessibility & responsiveness (required, not optional)

- Fully usable on a phone screen (mobile-first).
- Keyboard-navigable; screen-reader friendly; sufficient colour contrast; scalable text.

## Verification

- `npm run build` must pass (TypeScript + Vite) before any change is considered done.
- Prefer adding a lightweight test (Vitest) when introducing non-trivial logic.

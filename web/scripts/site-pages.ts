// Post-build step for GitHub Pages (static hosting):
//  1. Writes a real HTML file for every route (e.g. chapter/ch-02.html), each with
//     its own <title>, description and canonical URL. Deep links then return
//     HTTP 200 with meaningful metadata instead of the 404.html fallback.
//  2. Writes sitemap.xml listing every route.
//  3. Writes sw.js, a small service worker that precaches the whole build so the
//     site works offline (NFR-6). No extra runtime dependency is needed.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import type { Plugin } from "vite";

interface RoutePage {
  path: string; // app route without base, e.g. "chapter/ch-02"
  title: string;
  description: string;
}

const SITE_NAME = "BNS Study Platform";
const DEFAULT_DESCRIPTION =
  "A free, student-first study companion for the Bharatiya Nyaya Sanhita, 2023: summaries, key points, mind maps, MCQs, exam Q&A, fast revision and a bilingual dictionary, verified against the official Gazette.";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const clip = (s: string, n = 155) => (s.length <= n ? s : `${s.slice(0, n - 1).trimEnd()}…`);

const readJson = <T>(file: string): T => JSON.parse(readFileSync(file, "utf8")) as T;

function collectRoutes(dataDir: string): RoutePage[] {
  const routes: RoutePage[] = [
    { path: "", title: SITE_NAME, description: DEFAULT_DESCRIPTION },
    { path: "about", title: `About & how to use — ${SITE_NAME}`, description: "How to study with the BNS Study Platform, where the content comes from, and the disclaimer." },
    { path: "dictionary", title: `Dictionary — ${SITE_NAME}`, description: "Difficult and legal terms of the Bharatiya Nyaya Sanhita, 2023 explained in English and Hindi." },
    { path: "search", title: `Search — ${SITE_NAME}`, description: "Search chapters, sections, exam questions and dictionary terms of the BNS, 2023." },
  ];
  const chapterDir = join(dataDir, "chapters");
  for (const file of readdirSync(chapterDir).filter((f) => f.endsWith(".json")).sort()) {
    const c = readJson<{ id: string; number: string; title: string; shortDescription: string }>(join(chapterDir, file));
    routes.push({
      path: `chapter/${c.id}`,
      title: `Chapter ${c.number}: ${c.title} — ${SITE_NAME}`,
      description: clip(`BNS 2023 Chapter ${c.number} (${c.title}): ${c.shortDescription}`),
    });
    const sections = readJson<{ id: string; number: string; title: string; plainMeaning: string }[]>(
      join(dataDir, "sections", `${c.id}.json`),
    );
    for (const s of sections) {
      routes.push({
        path: `section/${s.id}`,
        title: `Section ${s.number}: ${s.title} — BNS 2023 — ${SITE_NAME}`,
        description: clip(`BNS section ${s.number}, ${s.title.replace(/\.$/, "")}. ${s.plainMeaning}`),
      });
    }
  }
  return routes;
}

function listFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listFiles(join(dir, e.name)) : [join(dir, e.name)],
  );
}

function serviceWorker(version: string, precache: string[]): string {
  return `// Generated at build time. Precaches the whole site for offline use.
const CACHE = "bns-${version}";
const PRECACHE = ${JSON.stringify(precache)};
const SHELL = "./index.html";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("bns-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === "navigate") {
    // Pages: network first (fresh content), fall back to cache, then app shell.
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          if (res.ok) caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(async () => {
          // Offline: this route's own page, then the app shell.
          const url = new URL(req.url);
          const page = url.pathname.endsWith("/") ? url.pathname + "index.html" : url.pathname + ".html";
          return (
            (await caches.match(req, { ignoreSearch: true, ignoreVary: true })) ||
            (await caches.match(page, { ignoreVary: true })) ||
            caches.match(SHELL, { ignoreVary: true })
          );
        }),
    );
    return;
  }
  // Hashed assets never change: cache first. ignoreVary because pages load
  // them with crossorigin (adds an Origin header the precache request lacked).
  event.respondWith(caches.match(req, { ignoreVary: true }).then((hit) => hit || fetch(req)));
});
`;
}

export function sitePages(options: { siteUrl: string; dataDir: string }): Plugin {
  let outDir = "";
  return {
    name: "site-pages",
    apply: "build",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const shell = readFileSync(join(outDir, "index.html"), "utf8");
      const routes = collectRoutes(options.dataDir);

      for (const r of routes) {
        const url = `${options.siteUrl}${r.path}`;
        const head =
          `<title>${escapeHtml(r.title)}</title>\n` +
          `    <meta name="description" content="${escapeHtml(r.description)}" />\n` +
          `    <link rel="canonical" href="${url}" />\n` +
          `    <meta property="og:type" content="website" />\n` +
          `    <meta property="og:site_name" content="${SITE_NAME}" />\n` +
          `    <meta property="og:title" content="${escapeHtml(r.title)}" />\n` +
          `    <meta property="og:description" content="${escapeHtml(r.description)}" />\n` +
          `    <meta property="og:url" content="${url}" />`;
        const html = shell
          .replace(/<title>[\s\S]*?<\/title>/, head)
          .replace(/\s*<meta\s+name="description"[\s\S]*?\/>/, "");
        // GitHub Pages serves "chapter/ch-02.html" for the URL "chapter/ch-02".
        const file = join(outDir, r.path === "" ? "index.html" : `${r.path}.html`);
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, html);
      }
      // Unknown paths still get the app shell (React Router shows "not found").
      writeFileSync(join(outDir, "404.html"), shell);

      const today = new Date().toISOString().slice(0, 10);
      const sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        routes.map((r) => `  <url><loc>${options.siteUrl}${r.path}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
        `\n</urlset>\n`;
      writeFileSync(join(outDir, "sitemap.xml"), sitemap);

      const precache = listFiles(outDir)
        .map((f) => relative(outDir, f).split("\\").join("/"))
        .filter((f) => f !== "sw.js" && f !== "404.html" && !f.endsWith(".map"))
        .map((f) => `./${f}`);
      const version = Date.now().toString(36);
      writeFileSync(join(outDir, "sw.js"), serviceWorker(version, precache));

      console.log(`site-pages: ${routes.length} route pages, sitemap.xml, sw.js (${precache.length} files precached)`);
    },
  };
}

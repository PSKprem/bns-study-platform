# BNS Study Platform — Technical Specification (Spec)

*Status: Draft v1 · Design phase. Implements [`requirements.md`](requirements.md); grounded in [`bns-study-platform-ideas.md`](bns-study-platform-ideas.md).*

This document answers **how** the platform is built. It turns the requirements into
concrete technical decisions: stack, architecture, data model, pages, components,
hosting, and the first-milestone build plan.

---

## 1. Technology Stack (and why)

| Layer | Choice | Why |
|---|---|---|
| Framework | **React** | Most widely used front-end library; strong for a portfolio/showcase; huge ecosystem. |
| Build tool | **Vite** | Fast dev server and builds; simplest modern React setup. |
| Language | **TypeScript** | Catches errors early; teaches good typing habits; safer content schemas. |
| Styling | **Tailwind CSS** | Fast, consistent, responsive/mobile-first styling without custom CSS sprawl. |
| Routing | **React Router** | Standard client-side routing for multi-page navigation (chapters, sections, dictionary). |
| Content | **JSON files** (in repo) | No server or database needed; free; version-controlled; content separate from code. |
| Mind map | **Markmap** (or React Flow) | Clickable/expandable mind maps without building from scratch. |
| Search | **Fuse.js** (client-side) | Lightweight fuzzy search over local JSON; no backend. |
| Local progress | **localStorage** | Persists flashcard/quiz progress on-device; no accounts needed (per requirements §8). |
| Hosting | **GitHub Pages** (or Vercel/Netlify) | Free static hosting; public live URL; ties to existing repo. |

**Key architectural principle:** this is a **static site** — all content ships as JSON,
rendered in the browser. No backend server, no database. This makes it free to host,
fast, offline-capable later (PWA), and simple to maintain.

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────┐
│                 Browser (student)            │
│                                              │
│   React App (UI components)                  │
│      │           │            │              │
│   reads        reads        reads            │
│      ▼           ▼            ▼              │
│  chapters.json  sections.json  dictionary.json ...   ← static content
│                                              │
│   localStorage  ← flashcard/quiz progress    │
└─────────────────────────────────────────────┘
                     │
              built by Vite
                     │
                     ▼
         Static files (HTML/JS/CSS/JSON)
                     │
                     ▼
        GitHub Pages  →  public live URL
```

- Content (JSON) is **decoupled from code** → new chapters are added as data, not code
  (satisfies NFR-7 "maintainable content" and CR-0 "complete coverage").
- Everything runs client-side → satisfies NFR-3 (free host), NFR-4 (live public URL),
  and enables NFR-6 (offline PWA later).

---

## 3. Data Model (content schemas)

Content lives in `data/` as typed JSON. These schemas are the contract the UI renders.

### 3.1 Chapter

```jsonc
{
  "id": "ch-02",
  "number": "II",
  "title": "Of Punishments",
  "sectionRange": "4-13",
  "shortDescription": "How punishment works as a system under BNS.",
  "subHeadings": [                 // the book's own "Of ___" groupings
    { "id": "types", "label": "Types of punishment", "sectionIds": ["s-4","s-5"] }
  ],
  "summary": "Plain-English overview (original language).",
  "keyPoints": [
    { "point": "Main point", "subPoints": ["sub A", "sub B"] }
  ],
  "fastRevision": ["Short must-know point 1", "Short must-know point 2"],
  "mindMap": "markdown or node-tree used to render the clickable mind map",
  "lastVerified": "2026-09-28"
}
```

### 3.2 Section (reference layer)

```jsonc
{
  "id": "s-4",
  "chapterId": "ch-02",
  "number": "4",
  "title": "Punishments",
  "bareActText": "Verbatim statute text (government material — public).",
  "plainMeaning": "Original-language explanation.",
  "ingredients": ["what must be proved 1", "..."],
  "punishment": "Term / fine / both.",
  "classification": {              // null where not applicable
    "cognizable": "…", "bailable": "…", "compoundable": "…", "triableBy": "…"
  },
  "ipcReference": { "section": "53 IPC", "changeNote": "what changed" },
  "illustrations": ["official illustration or rewritten example"],
  "termRefs": ["dishonestly","document"],   // links into dictionary
  "verification": { "status": "verified|unverified", "source": "BNS 2023 Gazette, s.4" },
  "lastVerified": "2026-09-28"
}
```

Every fact field carries `verification` + `source` → satisfies CR-1, CR-2, CR-5.

### 3.3 Exam Q&A

```jsonc
{
  "id": "qa-ch02-1",
  "chapterId": "ch-02",
  "question": "Exam-style question.",
  "modelAnswer": "Model answer in original language.",
  "difficulty": "basic|medium|hard"
}
```
Rendered in **Learn mode** (answer hidden, optional typing, reveal) and **Read mode**
(answer shown) → satisfies FR-5.2 / FR-5.3.

### 3.4 Dictionary term (bilingual)

```jsonc
{
  "id": "term-dishonestly",
  "term": "Dishonestly",
  "meaningEn": "Plain English meaning.",
  "meaningHi": "सरल हिन्दी अर्थ।",
  "relatedSections": ["s-4"]
}
```
Searchable in English or Hindi → satisfies FR-7. A **global** dictionary shows all terms;
a **per-chapter** dictionary shows only terms whose `relatedSections` fall in that chapter
(derived at runtime, so it scales as content grows) → satisfies FR-7.5.

### 3.5 Practice MCQ

```jsonc
{
  "id": "mcq-ch02-1",
  "chapterId": "ch-02",
  "question": "Multiple-choice question.",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 2,
  "explanation": "Why the correct option is correct."
}
```
Rendered as an interactive quiz with instant feedback, running score, and a result
summary → satisfies FR-8. *(MCQs replaced the originally-planned flashcards after review.)*

---

## 4. Pages & Navigation

| Route | Page | Requirements served |
|---|---|---|
| `/` | **Home / Course Map** — hero + all chapters | FR-1 |
| `/chapter/:id` | **Chapter page** — tabs: Mind Map · Summary · Key Points · Fast Revision · Practice (MCQ) · Exam Q&A · Sections · Dictionary. Supports `?tab=` deep-link | FR-2,3,4,4a,5,6,7.5,8,10.4 |
| `/section/:id` | **Section detail** — bare Act + fact fields + verification badge + "Back to sections" | FR-6, CR-1/2, FR-10.3 |
| `/dictionary` | **Global Dictionary** — searchable, bilingual, all terms | FR-7 |
| `/search` | **Search results** — grouped by type | FR-9 |

*(The originally-planned `/flashcards` route was removed; MCQ practice lives inside the
chapter as a tab.)*

Global layout: header (logo, dictionary, search, nav), main content, footer
("last verified", disclaimer). Consistent across pages → FR-10.

**Student learning flow** (reflected in the chapter tab order):
`Mind Map → Summary → Key Points → Fast Revision → Practice (MCQ) → Exam Q&A → Sections →
Dictionary` — i.e. *see structure → understand → revise → self-test → go deep → look up*,
matching the learning-first principles (§3 of requirements).

---

## 5. Component Breakdown

- `Layout` (header/footer/nav)
- `Home` (hero + chapter cards)
- `ChapterPage` (tabbed) → `MindMap`, summary, key points, fast revision, `MCQQuiz`,
  `ExamQA`, section list, chapter `TermList`
- `MindMap` (clickable, via Markmap; auto-fit + "Fit to screen")
- `MCQQuiz` (options, instant feedback, score, result summary)
- `ExamQA` with `mode: 'learn' | 'read'` toggle; `QACard` (reveal logic + optional input)
- `SectionPage` with `VerificationBadge`, term links, and "Back to sections"
- `TermList` (bilingual EN/HI, searchable) — shared by global Dictionary and chapter Dictionary tab
- `SearchPage` (grouped results)

---

## 6. Repository / Folder Structure

```
bns-study-platform/
├── docs/                  # ideas, requirements, spec (this file), architecture, tasks
├── data/                  # JSON content (imported by the app via the @data alias)
│   ├── course-outline.json   # all 20 chapters + section ranges (from the Gazette)
│   ├── chapters/ch-XX.json   # one per published chapter (auto-registered)
│   ├── sections/ch-XX.json
│   ├── qa/ch-XX.json
│   ├── mcqs/ch-XX.json
│   └── dictionary.json
├── content/               # (optional) source drafts before they become JSON
└── web/                   # the React + Vite app
    ├── index.html
    ├── package.json
    ├── vite.config.ts     # base path, @data alias, Tailwind, site-pages plugin
    ├── scripts/site-pages.ts  # route pages, sitemap.xml, 404.html, sw.js (build time)
    ├── public/            # favicon, app icons, manifest
    └── src/
        ├── main.tsx, App.tsx, routes.tsx   # routes lazy-loaded (code-split)
        ├── components/    # Layout, ChapterTabs, SectionGroups, TermList, VerificationBadge, ReportIssueLink
        ├── pages/         # Home, ChapterPage, SectionPage, DictionaryPage, SearchPage, AboutPage, NotFound
        ├── features/      # MindMap, ExamQA, MCQQuiz
        ├── types/         # TypeScript schemas (mirror §3)
        └── lib/           # content, search, routes, progress, theme, format, site
```

Tailwind is configured via the `@tailwindcss/vite` plugin (no separate `tailwind.config.js`).
Content in `data/` is imported by the app at build time. The book PDF stays out (CR-4).

---

## 7. Non-Functional Design Decisions

- **Mobile-first (NFR-1):** Tailwind responsive utilities; tab UI collapses gracefully.
- **Fast on slow networks (NFR-2):** static assets, code-splitting per route, small JSON per chapter (not one giant file).
- **Free & live (NFR-3/4):** GitHub Pages via a build workflow; public URL.
- **Accessible (NFR-5):** semantic HTML, keyboard-navigable tabs/cards, aria labels, sufficient contrast, scalable text.
- **Offline later (NFR-6):** add a service worker / PWA manifest after first milestone.
- **Maintainable (NFR-7):** add a chapter = add JSON files; no code change.

---

## 8. Deployment (live for everyone)

- Build with Vite (`npm run build`) → static files in `web/dist`.
- Deploy via **GitHub Actions → GitHub Pages** on every push to `main`.
- The **website is publicly readable** even though the code repo can remain private
  (GitHub Pages serves a public URL). If needed, the repo can be made public.
- Result: a shareable public URL any student can open — no install, no login.

---

## 9. First-Milestone Build Plan (Chapter II, end-to-end)

Concrete steps, in order:

1. **Scaffold** the Vite + React + TS + Tailwind app in `web/`; set up React Router + base `Layout`.
2. **Define TypeScript types** in `web/src/types/` mirroring the §3 schemas.
3. **Author Chapter II content** as JSON in `data/` (chapter, sections s.4–13, Q&A, flashcards, dictionary terms) — statute facts verified + sourced (CR-1/2).
4. **Home / Course Map** page listing chapters (FR-1).
5. **Chapter page** with the 5 tabs; wire in Chapter II content (FR-2–6).
6. **Mind Map** (clickable) for Chapter II (FR-2).
7. **Exam Q&A** with Learn/Read modes (FR-5).
8. **Section detail** page with verification badge + term links (FR-6).
9. **Dictionary** (EN/HI) with the Chapter II terms (FR-7).
10. **Flashcards** for Chapter II with localStorage progress (FR-8).
11. **Search** across the loaded content (FR-9).
12. **Responsive pass** + accessibility check (NFR-1/5).
13. **Deploy live** to GitHub Pages; confirm the public URL works (NFR-3/4).
14. **Verify against the Milestone "Definition of Done"** checklist in requirements §7.

Once done, further chapters are added as **JSON content only** — reusing all components.

---

*End of spec v1.*

# BNS Study Platform — Architecture

*Status: Draft v1 · Companion to [`spec.md`](spec.md). Where the spec lists all design
decisions and the build plan, this document focuses on **how the system is structured and
how data flows** — the mental model to return to when reasoning about the codebase.*

---

## 1. Architectural Overview

The platform is a **static, client-side single-page application (SPA)**. All study
content ships as **static JSON**, and the React app renders it entirely in the browser.
There is **no backend server and no database**.

```
        ┌──────────────────────── Build time ────────────────────────┐
        │                                                             │
   data/*.json  ──▶  imported/loaded  ──▶  Vite build  ──▶  web/dist  │
   (content)                                                          │
        └─────────────────────────────────────────────────────────────┘
                                        │
                                        ▼  deploy
                                 GitHub Pages (public URL)
                                        │
        ┌──────────────────────── Run time (browser) ────────────────┐
        │                                                             │
        │   React SPA                                                 │
        │     ├─ UI layer        (components / pages)                 │
        │     ├─ data-access     (load + parse JSON, search index)    │
        │     ├─ content         (static JSON: chapters/sections/…)   │
        │     └─ persistence     (localStorage: flashcard progress)   │
        │                                                             │
        └─────────────────────────────────────────────────────────────┘
```

**One-line summary:** *content is data, the app is a renderer, hosting is static.*

---

## 2. Architectural Principles

These govern every downstream decision:

1. **Static-first.** No server to run, secure, or pay for. The whole site is pre-built
   files served from a CDN/Pages. → free, fast, live (NFR-2/3/4).
2. **Content is decoupled from code.** Study content lives in `data/` as JSON, never
   hard-coded in components. Adding a chapter = adding data, not writing code. (NFR-7, CR-0)
3. **Client-only state.** No accounts; user progress lives in `localStorage` on the device.
   (requirements §8)
4. **Typed contracts.** TypeScript types mirror the JSON schemas so content and UI can
   never silently drift apart.
5. **Facts are traceable.** Every statute-fact field carries a verification status + source
   at the data layer, surfaced in the UI. (CR-1/2)
6. **Progressive capability.** Ships as a plain SPA; a PWA/offline layer is added later
   without re-architecting. (NFR-6)

---

## 3. Layered Structure

The app is organised into clear layers, each with a single responsibility:

```
┌─────────────────────────────────────────────┐
│ UI LAYER            pages/ + components/       │  renders content, handles interaction
├─────────────────────────────────────────────┤
│ FEATURE LAYER       features/                  │  mindmap, examqa, dictionary,
│                                                │  flashcards, search (self-contained)
├─────────────────────────────────────────────┤
│ DATA-ACCESS LAYER   lib/                        │  load JSON, build search index,
│                                                │  read/write localStorage
├─────────────────────────────────────────────┤
│ TYPE LAYER          types/                      │  TS interfaces = schema contracts
├─────────────────────────────────────────────┤
│ CONTENT LAYER       data/ (JSON)                │  the actual study material
└─────────────────────────────────────────────┘
```

**Rule of dependency:** upper layers depend on lower layers, never the reverse. UI never
reads a raw JSON file directly — it goes through the data-access layer, which returns
typed objects. This keeps content-loading logic in one place and the UI dumb and testable.

---

## 4. Data Flow — from JSON to screen

Example: a student opens Chapter II.

```
1. Router matches /chapter/ch-02
2. Chapter page asks data-access layer: getChapter("ch-02")
3. data-access loads data/chapters/ch-02.json, validates against Chapter type
4. Returns a typed Chapter object
5. Chapter page renders tabs; each tab component receives its slice:
      MindMap      ← chapter.mindMap
      Summary      ← chapter.summary
      KeyPoints    ← chapter.keyPoints
      ExamQA       ← getQA("ch-02")        (loads data/qa/ch-02.json)
      SectionList  ← getSections("ch-02")  (loads data/sections/ch-02/*.json)
6. SectionDetail renders fact fields + VerificationBadge (from section.verification)
7. TermLinks resolve against dictionary.json on demand
```

User interaction that persists (e.g., marking a flashcard "known") flows **down** to the
persistence layer:

```
Flashcard "known" click → features/flashcards → lib/progress.ts → localStorage
```

Static content is **read-only**; only user progress is writable, and only locally.

---

## 5. Content Pipeline (raw → verified JSON)

How material becomes trustworthy content (implements the blueprint's pipeline + CR-1/2):

```
Source material (book / official Gazette)
      │
      ▼  (1) extract facts + structure  — NOT verbatim commentary
draft in content/  (optional working area)
      │
      ▼  (2) rewrite explanations in original language   (CR-3)
      │
      ▼  (3) verify statute facts vs. official Gazette    (CR-1)
      │
      ▼  (4) encode as typed JSON in data/ with
             verification { status, source } + lastVerified  (CR-2, CR-5)
      │
      ▼  (5) consistency check (schema complete, refs reciprocal)
data/*.json  ← the app only ever consumes this verified output
```

The book PDF is **never** part of this repo or the served site (CR-4).

---

## 6. Directory Responsibilities

```
bns-study-platform/
├── docs/       # planning + design docs (ideas, requirements, spec, architecture)
├── data/       # ← CONTENT LAYER: verified JSON the app consumes
│   ├── chapters/     one file per chapter
│   ├── sections/     grouped per chapter (sections/ch-02/…)
│   ├── qa/           exam Q&A per chapter
│   ├── flashcards/   flashcards per chapter
│   └── dictionary.json   global bilingual terms
├── content/    # optional pre-JSON drafting area (not served)
└── web/        # the application
    └── src/
        ├── types/       schema contracts (TS interfaces)
        ├── lib/         data-access + search + localStorage (DATA-ACCESS LAYER)
        ├── features/    self-contained feature modules (FEATURE LAYER)
        ├── components/  shared presentational UI (UI LAYER)
        ├── pages/       route-level pages (UI LAYER)
        └── routes.tsx   route table
```

Each `data/` sub-folder maps 1:1 to a schema in spec §3.

---

## 7. State Management

Three distinct kinds of state, deliberately kept separate:

| Kind | Example | Where it lives | Writable? |
|---|---|---|---|
| **Static content** | chapter summary, section text | `data/*.json` (bundled) | No (read-only) |
| **Ephemeral UI state** | active tab, Q&A reveal toggle, search query | React component state | Yes (in-memory) |
| **Persisted user progress** | flashcard known/not-known, last review | `localStorage` | Yes (on device) |

No global state library is needed at this scale; React state + a thin `lib/progress.ts`
wrapper over `localStorage` is sufficient. (Can revisit if complexity grows.)

---

## 8. Build & Deploy Flow

```
git push main
      │
      ▼
GitHub Actions workflow
      │  npm ci → npm run build (Vite)  → web/dist (static files)
      ▼
GitHub Pages  →  serves web/dist at a public URL
```

- The **website is public** (anyone can read it) even if the **code repo is private**.
- No secrets or server config required — purely static output.

---

## 9. Key Architectural Decisions (with trade-offs)

| Decision | Chosen | Trade-off accepted |
|---|---|---|
| Backend? | **No — static site** | Can't do server-side accounts/sync now; solved later if needed. |
| Data store? | **JSON in repo** | Not a real DB; fine for read-heavy reference content, and it's free + versioned. |
| Accounts/auth? | **None (localStorage)** | Progress doesn't sync across devices; acceptable for v1, avoids huge complexity. |
| State library? | **React state only** | Might revisit if the app grows; avoids premature complexity. |
| Hosting? | **GitHub Pages** | Tied to GitHub; easy to migrate to Netlify/Vercel (same static output). |
| Content format? | **Per-chapter JSON files** | Many small files vs. one big file — chosen for lazy-loading and small payloads (NFR-2). |

These are recorded so future changes are *informed*, not accidental.

---

## 10. Scalability — 1 chapter to 20

The architecture is designed so growth is **content work, not engineering work**:

- Adding a chapter = add `data/chapters/ch-XX.json` (+ sections/qa/flashcards) and dictionary
  terms. **No component or route changes.**
- Search index is rebuilt from whatever content exists — scales automatically.
- Per-chapter file splitting keeps each page's payload small even at 20 chapters / 358 sections.
- The consistency-check step (pipeline §5) guards against schema drift as volume grows —
  the blueprint's identified "real engineering challenge."

The first milestone (Chapter II) exercises **every layer and feature** on a small scope, so
once it is live, the remaining chapters slot into a proven structure.

---

*End of architecture v1.*

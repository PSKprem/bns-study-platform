# BNS Study Platform — Tasks

*Living checklist. Break work into small, independently-completable tasks. Tick items as
they are finished. Each task cites the requirement (FR/NFR/CR) or spec step it satisfies.*

Legend: `[ ]` todo · `[x]` done · `[~]` in progress

---

## Phase 0 — Planning & Setup ✅ (complete)

- [x] Concept blueprint (`docs/bns-study-platform-ideas.md`)
- [x] Requirements document (`docs/requirements.md`)
- [x] Technical spec (`docs/spec.md`)
- [x] Architecture document (`docs/architecture.md`)
- [x] Create GitHub repo + `.gitignore` (book PDF excluded)
- [x] Scaffold `web/` app (Vite + React + TS + Tailwind + Router) — *spec §9.1*
- [x] Define TypeScript content types (`web/src/types/content.ts`) — *spec §9.2*
- [x] Deployment pipeline (GitHub Actions → Pages) + SPA 404 fallback — *NFR-3/4*
- [x] Site live at public URL (verified HTTP 200)
- [x] AI agent instructions + steering rules (`AGENTS.md`, `.kiro/steering/`)

---

## Phase 1 — First Milestone: Chapter II ("Of Punishments", s.4–13) end-to-end

Goal: prove the whole workflow on one small chapter. Definition of Done = `requirements.md` §7.

### 1A. Content authoring (data) — *spec §9.3, CR-0/1/2/3*

- [ ] Draft Chapter II section facts (s.4–13): bare Act text, punishment, classification
- [ ] Verify each fact against the official BNS 2023 Gazette; record source + `lastVerified`
- [ ] Write plain-language meaning + ingredients for each section (original prose)
- [ ] Encode sections as JSON in `data/sections/ch-02/*.json`
- [ ] Author chapter JSON in `data/chapters/ch-02.json` (summary, key points, sub-headings, mind map)
- [ ] Author exam Q&A in `data/qa/ch-02.json`
- [ ] Author flashcards in `data/flashcards/ch-02.json`
- [ ] Author dictionary terms appearing in Chapter II (English + Hindi) in `data/dictionary.json`
- [ ] Consistency check: every fact has verification + source; cross-refs reciprocal

### 1B. Data-access layer — *architecture §3/4*

- [ ] `lib/` loaders: getChapter, getSections, getQA, getFlashcards, getDictionary
- [ ] Wire loaders to the typed schemas; handle missing data gracefully

### 1C. Core UI — *spec §9.4/9.5*

- [ ] Home / Course Map: list chapters (Chapter II live) — *FR-1*
- [ ] Fix page `<title>` / basic metadata (currently default "web")
- [ ] Chapter page shell with tabs (Mind Map · Summary · Key Points · Exam Q&A · Sections) — *FR-2–6*

### 1D. Features — *spec §9.6–9.11*

- [ ] Mind Map (clickable) for Chapter II via Markmap — *FR-2*
- [ ] Chapter Summary rendering — *FR-3*
- [ ] Key Learning Points (structured outline) — *FR-4*
- [ ] Exam Q&A: Learn mode (reveal) + Read mode toggle — *FR-5*
- [ ] Section detail page + VerificationBadge + term links — *FR-6, CR-2*
- [ ] Dictionary page (bilingual, searchable EN/HI) — *FR-7*
- [ ] Flashcards with known/not-known + localStorage progress — *FR-8*
- [ ] Search across chapters/sections/terms/Q&A (Fuse.js) — *FR-9*

### 1E. Quality & polish — *NFR-1/2/5*

- [ ] Responsive pass (mobile layout for tabs, mind map, cards)
- [ ] Accessibility pass (keyboard nav, aria labels, contrast, text scaling)
- [ ] Performance check (per-chapter JSON, route code-splitting, lean bundle)
- [ ] Add a lightweight test setup (Vitest) for non-trivial logic (search, spaced repetition)

### 1F. Ship & verify — *requirements §7*

- [ ] `npm run build` passes cleanly
- [ ] Deployed live; confirm Chapter II works end-to-end on the public URL
- [ ] Tick every box in the Milestone Definition of Done (`requirements.md` §7)

---

## Phase 2 — Expand core reference (after milestone)

- [ ] Add 2–3 more chapters as JSON content (reuse components) — *content, not engineering*
- [ ] Statutory Dictionary expansion (Section 2 terms)
- [ ] Reasoning Toolkit cards (Section 3)
- [ ] Sub-heading–aware navigation for dense chapters

## Phase 3 — Interactive / practice

- [ ] General Exceptions decision-tree
- [ ] Offence Classifier ("Spot the Crime") practice mode
- [ ] Spaced-repetition quiz mode (weighted to wrong answers)

## Phase 4 — Differentiators

- [ ] Rights of Accused / Victim Justice modules
- [ ] Real-World Context Panel (optional)
- [ ] Trio-Code Cross-Linker (BNS ↔ BNSS ↔ BSA)

---

*Update this file as tasks complete. Keep tasks small — if a task feels big, split it.*

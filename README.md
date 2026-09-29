# BNS Study Platform

A study platform for law students built on the **Bharatiya Nyaya Sanhita, 2023 (BNS)** — India's new penal code that replaced the Indian Penal Code (IPC).

The goal: make the knowledge law students need to learn BNS available in one place, organised around **offence-based reasoning** rather than rote memorization.

---

## Status

🚀 **Live — Chapters I to V shipped.** The course map lists all 20 BNS chapters; the rest
are added as content (see [adding a chapter](docs/adding-a-chapter.md)).

**Live site:** https://pskprem.github.io/bns-study-platform/

**What's live:**
- Plain-language **summary**, structured **key points**, and **Fast Revision** must-know points
- Clickable, auto-fitting **mind map**
- **Practice MCQs** with instant feedback; best score saved on your device
- **Exam Q&A** in Learn (self-test) and Read modes
- **Section pages**: bare Act text, plain meaning, ingredients, worked examples, "mark as read"
- **Bilingual dictionary** (English + Hindi) — global and per-chapter, with deep links
- **Search**, dark mode, progress tracking, offline support, "Report it" feedback links

**Planning docs:** [ideas](docs/bns-study-platform-ideas.md) ·
[requirements](docs/requirements.md) · [spec](docs/spec.md) ·
[architecture](docs/architecture.md) · [tasks](docs/tasks.md)

> The bare Act text of every published section is **verified word for word** against the
> official Gazette of India (Act No. 45 of 2023) and carries a green verification badge
> with source and date.

---

## Core Idea

BNS is a penal code, so studying it is about:

- Identifying **which offence** a fact pattern falls under
- Remembering the **ingredients** of each offence (what must be proved)
- Knowing the **punishment** and procedural classification (cognizable / bailable / compoundable / triable-by)
- Mapping it back to the **old IPC section**
- Understanding how BNS interacts with **BNSS** (procedure) and **BSA** (evidence)

The platform is built around these skills.

---

## Planned Build Phases

**Phase 1 — Prove the concept (one small, high-value slice):**
- "What's No Longer a Crime" module (IPC provisions with no BNS equivalent)
- IPC ↔ BNS mapping for one chapter (Chapter VI as the test case)
- Homicide cluster comparison page

**Phase 2 — Expand the core reference:**
- Section-by-section content for 2–3 chapters
- Statutory Dictionary (Section 2) and Reasoning Toolkit (Section 3)
- Sub-heading–aware navigation

**Phase 3 — Interactive / practice features:**
- General Exceptions decision-tree
- Offence Classifier ("Spot the Crime") practice mode
- Retention tools (practice MCQs and Fast Revision shipped in Chapter II; spaced-repetition flashcards deferred)

**Phase 4 — Differentiators:**
- Rights of Accused / Victim Justice modules
- Real-World Context Panel
- Trio-Code Cross-Linker (BNS ↔ BNSS ↔ BSA)

See the blueprint for full detail.

---

## Legal Accuracy & Trust (non-negotiable)

For a tool students rely on for exams, verifiable accuracy is the product.

- **Statute facts** (bare Act text, punishments, classifications, IPC numbers) are verified against the **official BNS 2023 Gazette**, not a commentary.
- Every fact field carries a **verification status** and **source citation**.
- Each section page carries a **"last verified" date**; content changes are logged.

---

## Copyright Notice

This project is **inspired by** and structured with reference to *K. D. Gaur's commentary on the Bharatiya Nyaya Sanhita*, but:

- The **bare Act text** is government material (public) and may be reproduced.
- The **author's commentary, illustration phrasing, case selection, and specific wording are copyrighted** and are **NOT** reproduced. All explanatory content on the platform is **rewritten in original language**.
- **The source book PDF is never committed to this repository** (see `.gitignore`).

Rule: *extract facts and structure; rewrite prose.*

---

## Repository Structure

```
bns-study-platform/
├── docs/          # Planning docs: ideas, requirements, spec, architecture, tasks
├── data/          # Study content as JSON (chapters, sections, qa, mcqs, dictionary)
├── content/       # Optional drafting area before content becomes JSON
├── web/           # The website (React + Vite + TypeScript + Tailwind)
└── .github/       # CI/CD workflow (auto-deploy to GitHub Pages)
```

---

## License

To be decided. Code and original content will be licensed separately; no third-party copyrighted material is included.

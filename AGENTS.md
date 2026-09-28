# AGENTS.md — Instructions for AI Agents & Contributors

This file is loaded automatically into the AI agent's context. It is the entry point
for how to work on this project. Detailed rules live in [`.kiro/steering/`](.kiro/steering/).

## What this project is

A **learning & revision companion website for law students** studying the **Bharatiya
Nyaya Sanhita, 2023 (BNS)** — India's penal code that replaced the IPC.

- Purpose: help a student **read, understand, revise, and pass the exam** — learning-first.
- Planning docs: [`docs/`](docs/) (ideas → requirements → spec → architecture → tasks). **Read them
  before making design decisions.**
- Live site: https://pskprem.github.io/bns-study-platform/ (auto-deployed from `main`).

## Golden rules (read before doing anything)

1. **Never commit the source book PDF** (`K D Gaur BNS.pdf`) or any copyrighted material.
   It is git-ignored — keep it that way.
2. **Extract facts and structure; rewrite prose.** Bare Act text (government material) may
   be reproduced verbatim. Author commentary/wording must be rewritten in original language.
3. **Accuracy is the product.** Every statute fact (punishment, classification, IPC number)
   must carry a verification status + source. Never present unverified facts as verified.
4. **Follow the phase plan.** Build the first milestone (Chapter II) end-to-end before
   scaling to other chapters. Don't build everything at once.
5. **Verify before claiming done.** Run `npm run build` after code changes; cite the result.
6. **Content is data, not code.** Study content lives in `data/*.json`, never hard-coded.

## Detailed rules (in `.kiro/steering/`, auto-loaded)

- `project-rules.md` — project guardrails and non-negotiables
- `coding-style.md` — code conventions and style
- `tech-performance.md` — stack and performance standards
- `workflow.md` — git, verification, and process rules

## Quick reference

- App lives in `web/` (React + Vite + TypeScript + Tailwind).
- Build: `cd web && npm run build`. Dev: `npm run dev`.
- Deploy: automatic on push to `main` (GitHub Actions → GitHub Pages).

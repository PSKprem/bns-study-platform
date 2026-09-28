# Workflow & Process

## Development phases (follow in order)

Ideas → Requirements → Spec → Architecture → **Implementation**. The planning docs in
`docs/` are the source of truth; update them if a decision changes.

Chapters I and II are live. New chapters follow `docs/adding-a-chapter.md`.

## Git

- Work on a branch (e.g. `content/ch-03`, `fix/...`), not directly on `main`.
- Open a pull request; the **CI** workflow runs lint, tests and build on every PR.
  Merge only when CI is green. Merging to `main` deploys the site automatically.
- Commit in small, logical units with clear messages describing the *why*.
- Never stage the book PDF or `node_modules`/`dist` (they are git-ignored — verify with
  `git diff --cached --name-only` before committing).
- Don't force-push, reset --hard, or run other destructive git commands without asking.

## Verification (before saying "done")

1. `cd web && npm run lint:ci` — 0 warnings, 0 errors.
2. `npm run test:run` — all Vitest tests pass (loaders, search, progress, routes, data integrity).
3. `npm run build` — TypeScript + Vite + generated route pages succeed.
4. For UI changes, check in a browser (`npm run build && npm run preview`), including a
   phone-width window and keyboard-only use.
5. Cite the actual result (command output), not an assumption.

## Content workflow

1. Take the bare Act text verbatim from the official Gazette of India (Act No. 45 of 2023).
2. Extract facts and structure; rewrite all explanations in original language.
3. Verify every statute fact against the Gazette before marking it `verified`.
4. Encode as typed JSON in `data/` with `verification` + `lastVerified`.
5. Run the data-integrity tests (schema, term links, section coverage).

## Definition of "done" for a feature

- Matches its acceptance criteria in `docs/requirements.md`.
- Lint, tests and build pass; responsive and accessible.
- Any statute facts carry verification status + source.
- Merged via a green PR, deployed, and confirmed working at the public URL.

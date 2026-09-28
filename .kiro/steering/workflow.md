# Workflow & Process

## Development phases (follow in order)

Ideas → Requirements → Spec → Architecture → **Implementation**. The planning docs in
`docs/` are the source of truth; update them if a decision changes.

Implementation follows the build plan in `docs/spec.md` §9. The current target is the
**first milestone: Chapter II end-to-end** (see `docs/requirements.md` §7 for the
Definition of Done).

## Git

- Commit in small, logical units with clear messages describing the *why*.
- Never stage the book PDF or `node_modules`/`dist` (they are git-ignored — verify with
  `git diff --cached --name-only` before committing).
- Push to `main` triggers auto-deploy; make sure the build passes locally first.
- Don't force-push, reset --hard, or run other destructive git commands without asking.

## Verification (before saying "done")

1. Run `cd web && npm run build` — it must succeed (TypeScript + Vite).
2. Run `npm run test:run` — all Vitest tests must pass (loaders, search, data integrity).
3. For UI changes, sanity-check in `npm run dev`.
4. Cite the actual result (build output / command result), not an assumption.

## Content workflow

1. Extract facts + structure from source (not verbatim commentary).
2. Rewrite explanations in original language.
3. Verify statute facts against the official BNS 2023 Gazette.
4. Encode as typed JSON in `data/` with `verification` + `lastVerified`.
5. Consistency-check: schema complete, cross-references reciprocal.

## Definition of "done" for a feature

- Matches its acceptance criteria in `docs/requirements.md`.
- Builds cleanly; is responsive and accessible.
- Any statute facts carry verification status + source.
- Deployed live (auto) and confirmed working at the public URL when relevant.

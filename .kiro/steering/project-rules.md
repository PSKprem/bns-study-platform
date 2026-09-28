# Project Rules & Guardrails

Non-negotiable rules for the BNS Study Platform. These override convenience or speed.

## Legal & content safety

- **Never commit the book PDF** or any copyrighted source file. Keep `*.pdf` git-ignored.
- **Never reproduce copyrighted commentary verbatim.** Author explanations, illustration
  phrasing, and specific wording must be rewritten in original language.
- **Bare Act text is public** (government material) and may be reproduced exactly.
- **All explanatory prose on the platform is original**, not copied.

## Accuracy

- Every statute-fact field (bare Act text, punishment, classification, IPC number) MUST
  carry a `verification` object (`status` + `source`) and a `lastVerified` date.
- Statute facts are verified against the **official BNS 2023 Gazette**, not a commentary.
- Unverified fields MUST be visibly flagged in the UI — never shown silently as fact.
- Classification and punishment fields are the highest-stakes content — double-check them.

## Scope discipline

- Build the **first milestone (Chapter II) end-to-end** before scaling to more chapters.
- Adding a new chapter must be **content work (JSON), not engineering** — if it needs new
  code, reconsider the design.
- Features marked "optional / out of scope" in the requirements stay deferred until the
  milestone is met.

## Student-first principle

- Every feature must help a student **understand** or **remember** — not just look up.
- Prefer active recall (self-test) designs over passive reading where there's a choice.
- Keep language plain; link difficult terms to the bilingual dictionary.

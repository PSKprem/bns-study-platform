# Adding a chapter

Adding a chapter is content work only. Chapters register themselves: every
`data/chapters/ch-XX.json` (plus its siblings below) is picked up at build time by
`web/src/lib/content.ts`. No code changes, and the Home page switches the chapter from
"Coming soon" to live automatically.

## Files to create

Use the chapter id from `data/course-outline.json` (e.g. `ch-03`). Copy the shape from
the existing Chapter II files.

| File | Contents |
|---|---|
| `data/chapters/ch-XX.json` | `id`, `number`, `title`, `sectionRange` (must match `course-outline.json`), `shortDescription`, `subHeadings`, `summary` (paragraphs separated by a blank line), `keyPoints`, `fastRevision` (20–50 one-liners), `mindMap` (Markdown outline), `lastVerified` |
| `data/sections/ch-XX.json` | One object per section, in order, covering every number in `sectionRange` |
| `data/qa/ch-XX.json` | Exam questions with model answers (`difficulty`: basic / medium / hard) |
| `data/mcqs/ch-XX.json` | MCQs with `options`, `correctIndex`, `explanation` |
| `data/dictionary.json` | Add new terms (English + Hindi); link them from sections via `termRefs` and back via `relatedSections` |

## Verification checklist (every section)

- [ ] `bareActText` copied **verbatim** from the official Gazette of India
      (Extraordinary, Part II Sec. 1, Act No. 45 of 2023). Keep the official
      Explanations and Illustrations in it. Do not paraphrase.
- [ ] Punishment, classification and IPC numbers checked against the Gazette (and the
      BNSS First Schedule for classification). These are the highest-stakes fields.
- [ ] `verification.status` is `verified` only after that check; otherwise `unverified`
      (the site shows an amber warning).
- [ ] `verification.source` names the source; `lastVerified` is the check date.
- [ ] `plainMeaning`, `ingredients`, worked examples (`illustrations`), Q&A and MCQs are
      original writing, not copied from any commentary.
- [ ] Every section id appears in exactly one `subHeadings` group.

Extracting the Gazette text: `pdftotext -x 118 -y 40 -W 365 -H 760 gazette.pdf out.txt`
crops the margin notes so the body reads in order. Watch for words that wrap across a
page break landing in the wrong place.

## Check it

```sh
cd web
npm run lint:ci   # 0 warnings
npm run test:run  # data-integrity tests catch missing fields, broken term links,
                  # bad MCQ answers, gaps in the section range, sub-heading coverage
npm run build     # also generates the chapter's route pages and sitemap entries
```

Then open a pull request; CI runs the same checks before it can be merged.

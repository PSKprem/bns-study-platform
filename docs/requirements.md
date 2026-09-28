# BNS Study Platform — Requirements

*Status: Draft v1 · Follows the concept blueprint in [`bns-study-platform-ideas.md`](bns-study-platform-ideas.md).*

This document defines **what** the platform must do and **for whom** — not how it is
built (that is the Design phase) and not the build itself (Implementation). It is the
contract we check the finished work against.

---

## 1. Purpose & Vision

A **learning and revision companion** for a law student studying the **Bharatiya Nyaya
Sanhita, 2023 (BNS)** as part of a course. A student should be able to *read from it to
learn*, *understand difficult material in plain language*, *test themselves*, and
*revise fast before exams* — all in one place, hosted live and free to use.

The platform is **learning-first** (help a student understand and remember), with a
**reference layer** (section detail) as supporting material — not the other way around.

---

## 2. Users

- **Primary — Law student** taking a BNS course. Arrives *not knowing* the material and
  needs to learn it, understand hard terms, and prepare for exams.
- **Secondary — Self-learner / revising junior** who wants quick, structured revision and
  a reliable reference.

Design decisions are made for the **primary user** first.

---

## 3. Guiding Principles

Grounded in how learning actually works (active recall, spacing, chunking, dual coding):

1. **Learning-first.** Every feature should help a student *understand* or *remember*,
   not just *look up*.
2. **See structure before detail.** Orient with a map/overview, then go deep.
3. **Active recall over passive reading.** Prefer self-testing; support passive reading too.
4. **Plain language.** Remove the "I don't even understand the words" barrier.
5. **Accuracy is the product.** Facts a student relies on for exams must be verifiable.
6. **Simple, fast, accessible.** Usable on a phone, on a slow connection, by everyone.

---

## 4. Functional Requirements

Written as **user stories** + **acceptance criteria** (EARS style: "WHEN … THE SYSTEM SHALL …").

### 4.1 Chapter Overview / Course Map

> **As a** student, **I want** to see all BNS chapters and their structure, **so that** I
> know the shape of the course and can navigate to any chapter.

- FR-1.1 WHEN a user opens the platform, THE SYSTEM SHALL display a list of all BNS
  chapters with title, section range, and a short one-line description.
- FR-1.2 WHEN a user selects a chapter, THE SYSTEM SHALL open that chapter's study page.
- FR-1.3 THE SYSTEM SHALL group each chapter's sections under the book's own sub-headings
  ("Of theft," etc.) rather than one flat list.

### 4.2 Mind Map (clickable) — per chapter

> **As a** student, **I want** a clickable visual map of a chapter, **so that** I can grasp
> and recall its structure quickly.

- FR-2.1 WHEN a user opens a chapter, THE SYSTEM SHALL display a clickable mind map of that
  chapter (chapter → sub-heading groups → key topics).
- FR-2.2 WHEN a user clicks a mind-map node, THE SYSTEM SHALL expand it or navigate to the
  related summary/section.
- FR-2.3 THE SYSTEM SHALL render the mind map legibly on both desktop and mobile.

### 4.3 Chapter Summary

> **As a** student, **I want** a plain-English summary of each chapter, **so that** I can
> understand it without wading through dense statute language.

- FR-3.1 WHEN a user opens a chapter, THE SYSTEM SHALL provide a concise plain-language
  summary of the whole chapter.
- FR-3.2 THE SYSTEM SHALL write the summary in original language (no verbatim copyrighted
  commentary).

### 4.4 Key Learning Points — per chapter

> **As a** student, **I want** the main points and sub-points of a chapter in a structured,
> scannable form, **so that** I can revise the essentials fast.

- FR-4.1 WHEN a user opens a chapter, THE SYSTEM SHALL display key learning points as a
  structured outline (main points with nested sub-points).
- FR-4.2 THE SYSTEM SHALL keep each point short and scannable.

### 4.4a Fast Revision — per chapter *(added after review)*

> **As a** student, **I want** a list of crisp must-know points, **so that** I can revise a
> whole chapter quickly right before an exam.

- FR-4a.1 WHEN a user opens a chapter, THE SYSTEM SHALL provide a "Fast Revision" list of
  short (one–two line) must-know points for that chapter.
- FR-4a.2 THE SYSTEM SHALL keep this list scannable and revision-oriented (typically 20–50 points).

### 4.5 Exam Q&A — per chapter (Learn mode + Read mode)

> **As a** student, **I want** exam-style questions with model answers, in a self-test mode
> and a quick-read mode, **so that** I can either test myself or revise quickly.

- FR-5.1 WHEN a user opens the Exam Q&A for a chapter, THE SYSTEM SHALL present
  exam-style questions relevant to that chapter with model answers.
- FR-5.2 THE SYSTEM SHALL provide a **Learn mode**: the question is shown first, the answer
  is hidden until the user chooses to reveal it (supports active recall).
- FR-5.3 THE SYSTEM SHALL provide a **Read mode**: question and answer are shown together
  for fast revision without typing.
- FR-5.4 WHEN a user switches between Learn and Read mode, THE SYSTEM SHALL preserve their
  place in the question set.
- FR-5.5 In Learn mode, THE SYSTEM SHALL allow (but not require) the user to type an answer
  before revealing the model answer.

### 4.6 Section Detail (reference layer — support)

> **As a** student, **I want** to read the detail of an individual section when I need depth,
> **so that** I can go beyond the summary for important provisions.

- FR-6.1 WHEN a user selects a section, THE SYSTEM SHALL show: bare Act text, plain-language
  meaning, ingredients/essentials, punishment, and (where applicable) classification and
  IPC cross-reference.
- FR-6.2 THE SYSTEM SHALL show a verification status and source for every fact field
  (see §6).
- FR-6.3 THE SYSTEM SHALL link difficult terms in a section to their Dictionary entry.

### 4.7 Dictionary (bilingual: English + Hindi)

> **As a** student, **I want** hard/legal terms explained simply in English and Hindi, **so
> that** I can actually understand the material — both globally and within the chapter I'm reading.

- FR-7.1 THE SYSTEM SHALL provide a searchable **global dictionary** of difficult/legal terms
  spanning the whole book.
- FR-7.2 WHEN a user opens a dictionary term, THE SYSTEM SHALL show its meaning in **both
  English and Hindi**.
- FR-7.3 WHEN a user searches, THE SYSTEM SHALL match terms in either English or Hindi.
- FR-7.4 THE SYSTEM SHALL allow linking to a term from within chapter/section content.
- FR-7.5 WHEN a user is in a chapter, THE SYSTEM SHALL also provide a **per-chapter dictionary**
  showing only the terms relevant to that chapter *(added after review)*. Chapter-relevant terms
  are derived from the terms linked to that chapter's sections, so they scale automatically.

### 4.8 Practice MCQs — per chapter (active testing)

> **As a** student, **I want** multiple-choice practice questions with instant feedback, **so
> that** I can actively test my understanding.

- FR-8.1 WHEN a user opens the Practice (MCQ) view for a chapter, THE SYSTEM SHALL present
  multiple-choice questions relevant to that chapter.
- FR-8.2 WHEN a user selects an option, THE SYSTEM SHALL immediately show whether it is
  correct and display an explanation.
- FR-8.3 THE SYSTEM SHALL track the score across the question set and show a result summary.
- FR-8.4 THE SYSTEM SHALL allow restarting the quiz.

*Note: MCQs replace the originally-planned flashcards/spaced-repetition feature, chosen after
review because active multiple-choice testing paired with Fast Revision (FR-4a) better serves
both self-testing and quick revision. Spaced-repetition flashcards may return in a later phase.*

### 4.9 Search — global

> **As a** student, **I want** to search everything, **so that** I can find a topic, section,
> or term instantly.

- FR-9.1 WHEN a user types a query, THE SYSTEM SHALL search across chapters, summaries,
  sections, and dictionary terms.
- FR-9.2 THE SYSTEM SHALL show results grouped by type (chapter / section / term / Q&A).

### 4.10 Navigation

- FR-10.1 THE SYSTEM SHALL let a user move between chapters and back to the course map from
  any page.
- FR-10.2 THE SYSTEM SHALL keep a clear, consistent layout across all pages.
- FR-10.3 WHEN a user opens a section from a chapter, THE SYSTEM SHALL provide a clear
  "Back to sections" action that returns them to that chapter's Sections view *(added after review)*.
- FR-10.4 THE SYSTEM SHALL support deep-linking to a specific chapter view via a `?tab=` query
  parameter *(added after review)*.

---

## 5. Non-Functional Requirements

- NFR-1 **Mobile-friendly.** THE SYSTEM SHALL be fully usable on a phone screen.
- NFR-2 **Fast on slow connections.** Pages SHALL load quickly on a typical mobile network.
- NFR-3 **Free to host.** THE SYSTEM SHALL be hostable at no cost (e.g., static hosting /
  GitHub Pages).
- NFR-4 **Live & public to read.** THE SYSTEM SHALL be reachable by students at a public URL.
- NFR-5 **Accessible.** THE SYSTEM SHALL support keyboard navigation and screen readers, with
  readable contrast and text sizing.
- NFR-6 **Offline-capable (target).** THE SYSTEM SHOULD allow reading previously loaded
  content without a connection (PWA — may come after first milestone).
- NFR-7 **Maintainable content.** Content SHALL be stored in a structured, editable format so
  chapters can be added without changing code.

---

## 6. Content & Accuracy Requirements

- CR-0 **Complete section coverage.** THE SYSTEM SHALL include **every BNS section (s.1–s.358)**
  so a student is never missing a provision. For each section, the **bare Act text**
  (the actual law — government material) SHALL be reproduced in full, along with its
  section number, title, punishment, and classification. The accompanying **study content**
  (plain-language meaning, key points, summaries, illustrations phrased as examples) SHALL
  cover everything the material teaches but SHALL be written in original language — never
  copied verbatim from any copyrighted commentary (see CR-3).
- CR-1 **Statute facts verified against official source.** Bare Act text, punishments, and
  classifications SHALL be verified against the official BNS 2023 Gazette, not a commentary.
- CR-2 **Verification status per fact field.** Each fact field SHALL carry a status
  (verified / unverified) and a source citation; unverified fields SHALL be visibly flagged.
- CR-3 **Copyright boundary.** Bare Act text (government material) MAY be reproduced.
  Commentary, illustration phrasing, and specific wording from any copyrighted book SHALL
  NOT be reproduced; all explanatory prose SHALL be written in original language.
  Rule: *extract facts and structure; rewrite prose.*
- CR-4 **Source book never published.** The source book PDF SHALL never be committed to the
  repository or served by the platform.
- CR-5 **Currency.** Each chapter/section SHALL record a "last verified" date.

---

## 7. First Milestone — One Complete Chapter (Chapter II: "Of Punishments", s.4–13)

The first milestone proves the whole workflow end-to-end on a small, safe scope.

**Definition of Done (all must be true):**

- [ ] Chapter II has a clickable **mind map**.
- [ ] Chapter II has a plain-English **summary**.
- [ ] Chapter II has structured **key learning points**.
- [ ] Chapter II has **Exam Q&A** working in both **Learn** and **Read** modes.
- [ ] Chapter II's **sections (s.4–13)** are viewable with their fact fields + verification status.
- [ ] The **Dictionary** works and contains the difficult terms appearing in Chapter II,
      each with **English + Hindi** meaning.
- [ ] **Flashcards** exist for Chapter II with basic known/not-known tracking.
- [ ] **Search** finds Chapter II content and dictionary terms.
- [ ] The site is **responsive** (works on mobile) and **deployed live** at a public URL.
- [ ] All Chapter II statute facts carry a **verification status + source**.

Once this is met, later chapters are added as **content**, reusing the same structure —
no new engineering required for the core features.

---

## 8. Out of Scope (for now)

Deferred until after the first milestone proves the concept:

- User accounts / login / cloud sync (progress is stored locally on-device for now).
- Offence Classifier ("Spot the Crime") practice mode.
- General Exceptions interactive decision-tree.
- Trio-Code Cross-Linker (BNS ↔ BNSS ↔ BSA).
- Real-World Context Panel.
- Full case-law content.

These remain in the blueprint and can be added in later phases.

---

*End of requirements v1.*

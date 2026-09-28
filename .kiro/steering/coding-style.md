# Coding Style & Conventions

For the `web/` app (React + TypeScript + Tailwind).

## TypeScript

- **Strict mode on.** No `any` — use `unknown` and narrow, or define a proper type.
- Content shapes are defined once in `src/types/content.ts` and reused; JSON content must
  match these types.
- Prefer `type`/`interface` for data; prefer explicit return types on exported functions.
- Prefer `const` over `let`; avoid mutation where a pure transform is clearer.

## React

- **Function components + hooks only.** No class components.
- One component per file; name the file after the component (`ChapterTabs.tsx`).
- Keep components small and focused; extract a subcomponent when a file grows unwieldy.
- Presentational components in `components/`; route pages in `pages/`; self-contained
  feature modules in `features/`; data access, search, storage in `lib/`.
- UI never reads raw JSON directly — it goes through the `lib/` data-access layer.

## Styling

- **Tailwind utility classes** for styling. Avoid separate CSS files except global base.
- Mobile-first: default styles target small screens; add `sm:`/`md:`/`lg:` for larger.
- Use semantic HTML elements; include `aria-*` and labels for interactive elements.

## Naming

- Components: `PascalCase`. Functions/variables: `camelCase`. Types/interfaces: `PascalCase`.
- Content IDs: kebab/short form as in the schema (`ch-02`, `s-4`, `term-dishonestly`).

## General

- Comment the *why*, not the *what*. Non-obvious logic gets a short comment.
- Small, focused commits with clear messages.
- No unused imports, variables, or dead code left behind.

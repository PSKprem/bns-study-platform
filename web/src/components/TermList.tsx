import { useEffect, useMemo, useState } from "react";
import type { DictionaryTerm } from "../types/content";
import { termAnchorId } from "../lib/routes";

// Reusable bilingual term list with optional search. Shared by the global
// Dictionary page and the per-chapter Dictionary tab. When `highlightId` is set
// (from a ?term= deep link), that term is scrolled into view and highlighted.
export default function TermList({
  terms,
  searchable = true,
  highlightId,
}: {
  terms: DictionaryTerm[];
  searchable?: boolean;
  highlightId?: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.meaningEn.toLowerCase().includes(q) ||
        t.meaningHi.includes(query.trim()),
    );
  }, [query, terms]);

  useEffect(() => {
    if (!highlightId) return;
    const el = document.getElementById(termAnchorId(highlightId));
    if (!el) return;
    el.scrollIntoView({ block: "center" });
    el.focus({ preventScroll: true });
  }, [highlightId]);

  return (
    <div>
      {searchable && (
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a term (English or हिन्दी)…"
          aria-label="Search dictionary"
          className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-900"
        />
      )}

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {filtered.map((t) => {
          const highlighted = t.id === highlightId;
          return (
            <li
              key={t.id}
              id={termAnchorId(t.id)}
              tabIndex={highlighted ? -1 : undefined}
              aria-current={highlighted ? "true" : undefined}
              className={`scroll-mt-24 rounded-2xl border bg-white p-4 shadow-sm outline-none dark:bg-slate-900 ${
                highlighted
                  ? "border-indigo-400 ring-2 ring-indigo-300 dark:border-indigo-500 dark:ring-indigo-700"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.term}</h3>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                <span className="font-medium text-indigo-600 dark:text-indigo-400">EN </span>
                {t.meaningEn}
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300" lang="hi">
                <span className="font-medium text-indigo-600 dark:text-indigo-400" lang="en">HI </span>
                {t.meaningHi}
              </p>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="text-slate-500 dark:text-slate-400">No matching terms.</li>
        )}
      </ul>
    </div>
  );
}

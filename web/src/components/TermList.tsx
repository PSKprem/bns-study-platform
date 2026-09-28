import { useMemo, useState } from "react";
import type { DictionaryTerm } from "../types/content";

// Reusable bilingual term list with optional search. Shared by the global
// Dictionary page and the per-chapter Dictionary tab.
export default function TermList({
  terms,
  searchable = true,
}: {
  terms: DictionaryTerm[];
  searchable?: boolean;
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

  return (
    <div>
      {searchable && (
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a term (English or हिन्दी)…"
          aria-label="Search dictionary"
          className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      )}

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {filtered.map((t) => (
          <li
            key={t.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h3 className="font-semibold text-slate-900">{t.term}</h3>
            <p className="mt-1 text-sm text-slate-700">
              <span className="font-medium text-indigo-500">EN </span>
              {t.meaningEn}
            </p>
            <p className="mt-1 text-sm text-slate-700">
              <span className="font-medium text-indigo-500">HI </span>
              {t.meaningHi}
            </p>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-slate-500">No matching terms.</li>
        )}
      </ul>
    </div>
  );
}

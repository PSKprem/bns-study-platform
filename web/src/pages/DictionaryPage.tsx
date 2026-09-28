import { useMemo, useState } from "react";
import { getDictionary } from "../lib/content";

export default function DictionaryPage() {
  const terms = getDictionary();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return terms;
    // Match English or Hindi (FR-7.3).
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.meaningEn.toLowerCase().includes(q) ||
        t.meaningHi.includes(query.trim()),
    );
  }, [query, terms]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dictionary</h1>
      <p className="mt-1 text-sm text-slate-500">
        Difficult and legal terms explained in English and Hindi.
      </p>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a term (English or हिन्दी)…"
        aria-label="Search dictionary"
        className="mt-4 w-full max-w-md rounded border border-slate-300 px-3 py-2 text-sm"
      />

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {filtered.map((t) => (
          <li
            key={t.id}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <h2 className="font-semibold text-slate-900">{t.term}</h2>
            <p className="mt-1 text-sm text-slate-700">
              <span className="font-medium text-slate-500">EN: </span>
              {t.meaningEn}
            </p>
            <p className="mt-1 text-sm text-slate-700">
              <span className="font-medium text-slate-500">HI: </span>
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

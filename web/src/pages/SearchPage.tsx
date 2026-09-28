import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { search, type SearchType } from "../lib/search";

const TYPE_LABELS: Record<SearchType, string> = {
  chapter: "Chapters",
  section: "Sections",
  term: "Dictionary",
  qa: "Exam Q&A",
};

const TYPE_ORDER: SearchType[] = ["chapter", "section", "qa", "term"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => search(query), [query]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof results> = {};
    for (const r of results) {
      (map[r.type] ??= []).push(r);
    }
    return map;
  }, [results]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Search</h1>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search chapters, sections, terms, questions…"
        aria-label="Search all content"
        className="mt-4 w-full max-w-md rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        autoFocus
      />

      {query.trim() && results.length === 0 && (
        <p className="mt-4 text-slate-500 dark:text-slate-400">No results for “{query}”.</p>
      )}

      <div className="mt-5 space-y-6">
        {TYPE_ORDER.filter((t) => grouped[t]?.length).map((t) => (
          <section key={t}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {TYPE_LABELS[t]}
            </h2>
            <ul className="mt-2 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
              {grouped[t].map((r) => (
                <li key={`${r.type}-${r.id}`}>
                  <Link
                    to={r.path}
                    className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <p className="font-medium text-slate-900 dark:text-slate-100">{r.title}</p>
                    <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                      {r.text}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

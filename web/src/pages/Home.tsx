import { Link } from "react-router-dom";
import { getChapters } from "../lib/content";

export default function Home() {
  const chapters = getChapters();

  return (
    <div>
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-8 text-white shadow-sm sm:p-12">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Learn the Bharatiya Nyaya Sanhita, 2023
        </h1>
        <p className="mt-3 max-w-2xl text-indigo-100">
          A student-first study companion for India's new penal code. Understand
          each chapter with plain-language summaries, key points, mind maps,
          practice MCQs, fast revision, exam Q&amp;A, and a bilingual dictionary
          — all in one place.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          {[
            "Summaries",
            "Key points",
            "Mind maps",
            "Practice MCQs",
            "Fast revision",
            "Dictionary (EN + हिन्दी)",
          ].map((f) => (
            <span
              key={f}
              className="rounded-full bg-white/15 px-3 py-1 backdrop-blur"
            >
              {f}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-800">Course Map</h2>
        <p className="mt-1 text-sm text-slate-500">
          Pick a chapter to start studying.
        </p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {chapters.map((c) => (
            <li key={c.id}>
              <Link
                to={`/chapter/${c.id}`}
                className="group block h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 font-bold text-white">
                    {c.number}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                    s.{c.sectionRange}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-slate-900 group-hover:text-indigo-700">
                  {c.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {c.shortDescription}
                </p>
                <span className="mt-3 inline-block text-sm font-medium text-indigo-600">
                  Start studying →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

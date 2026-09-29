import { Link } from "react-router-dom";
import { getChapter, getCourseOutline, getDictionary, getSections } from "../lib/content";
import { chapterPath } from "../lib/routes";
import { chapterReadFraction } from "../lib/progress";
import { useProgress } from "../lib/useProgress";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const FEATURES = [
  "Summaries",
  "Key points",
  "Mind maps",
  "Practice MCQs",
  "Fast revision",
];

export default function Home() {
  useDocumentTitle();
  const outline = getCourseOutline();
  const progress = useProgress();
  const available = outline.filter((c) => c.available).length;

  return (
    <div>
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
        <ul className="mt-5 flex flex-wrap gap-2 text-sm">
          {FEATURES.map((f) => (
            <li key={f} className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">
              {f}
            </li>
          ))}
          <li>
            <Link
              to="/dictionary"
              className="block rounded-full bg-white px-3 py-1 font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              Dictionary (EN + हिन्दी) — {getDictionary().length} terms →
            </Link>
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          {progress.lastVisited && (
            <Link
              to={progress.lastVisited.path}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50"
            >
              Continue: {progress.lastVisited.label} →
            </Link>
          )}
          <Link
            to="/about"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/50 hover:bg-white/10"
          >
            How to use this site
          </Link>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="course-map">
        <h2 id="course-map" className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Course Map
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          All 20 chapters of the BNS (358 sections). {available} of 20 are ready to
          study; more are being added.
        </p>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2">
          {outline.map((c) => {
            if (!c.available) {
              return (
                <li key={c.id}>
                  <div className="flex h-full items-start gap-3 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {c.number}
                    </span>
                    <div>
                      <h3 className="font-medium text-slate-700 dark:text-slate-300">{c.title}</h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        s.{c.sectionRange} · Coming soon
                      </p>
                    </div>
                  </div>
                </li>
              );
            }
            const chapter = getChapter(c.id);
            const pct = Math.round(
              chapterReadFraction(getSections(c.id).map((s) => s.id), progress) * 100,
            );
            return (
              <li key={c.id}>
                <Link
                  to={chapterPath(c.id)}
                  className="group block h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 font-bold text-white">
                      {c.number}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      s.{c.sectionRange}
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold text-slate-900 group-hover:text-indigo-700 dark:text-slate-100 dark:group-hover:text-indigo-300">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {chapter?.shortDescription}
                  </p>
                  <div className="mt-3">
                    <div
                      className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                      role="progressbar"
                      aria-label={`Chapter ${c.number} sections read`}
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div className="h-full rounded-full bg-green-500" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{pct}% read</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

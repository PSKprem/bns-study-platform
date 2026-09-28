import { Link } from "react-router-dom";
import { getChapters } from "../lib/content";

export default function Home() {
  const chapters = getChapters();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Learn the Bharatiya Nyaya Sanhita, 2023
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        A student-first study companion: chapter summaries, key points, mind
        maps, exam Q&amp;A, a bilingual dictionary, and flashcards — all in one
        place.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-800">Course Map</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {chapters.map((c) => (
            <li key={c.id}>
              <Link
                to={`/chapter/${c.id}`}
                className="block rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50/40"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-indigo-700">
                    Chapter {c.number}
                  </span>
                  <span className="text-xs text-slate-400">
                    s.{c.sectionRange}
                  </span>
                </div>
                <h3 className="mt-1 font-semibold text-slate-900">{c.title}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {c.shortDescription}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

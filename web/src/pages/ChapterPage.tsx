import { lazy, Suspense, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getChapter, getQA, getSections } from "../lib/content";
import ExamQA from "../features/ExamQA";

// MindMap pulls in markmap + d3 (heavy); lazy-load so it code-splits out of
// the initial bundle and only loads when the Mind Map tab is opened.
const MindMap = lazy(() => import("../features/MindMap"));

const TABS = ["Mind Map", "Summary", "Key Points", "Exam Q&A", "Sections"] as const;
type Tab = (typeof TABS)[number];

export default function ChapterPage() {
  const { id = "" } = useParams();
  const chapter = getChapter(id);
  const [tab, setTab] = useState<Tab>("Mind Map");

  if (!chapter) {
    return (
      <div>
        <p className="text-slate-600">Chapter not found.</p>
        <Link to="/" className="text-indigo-700 underline">
          Back to course map
        </Link>
      </div>
    );
  }

  const sections = getSections(chapter.id);
  const qa = getQA(chapter.id);

  return (
    <div>
      <nav className="text-sm text-slate-500">
        <Link to="/" className="hover:underline">
          Course Map
        </Link>{" "}
        / Chapter {chapter.number}
      </nav>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">
        Chapter {chapter.number} — {chapter.title}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Sections {chapter.sectionRange} · Last verified: {chapter.lastVerified}
      </p>

      <div
        className="mt-4 flex flex-wrap gap-1 border-b border-slate-200"
        role="tablist"
        aria-label="Chapter sections"
      >
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm ${
              tab === t
                ? "border-indigo-600 font-semibold text-indigo-700"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "Mind Map" && (
          <Suspense
            fallback={
              <p className="text-sm text-slate-500">Loading mind map…</p>
            }
          >
            <MindMap markdown={chapter.mindMap} />
          </Suspense>
        )}

        {tab === "Summary" && (
          <p className="max-w-3xl leading-relaxed text-slate-700">
            {chapter.summary}
          </p>
        )}

        {tab === "Key Points" && (
          <ul className="max-w-3xl space-y-3">
            {chapter.keyPoints.map((kp, i) => (
              <li key={i} className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="font-semibold text-slate-900">{kp.point}</p>
                {kp.subPoints.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-sm text-slate-600">
                    {kp.subPoints.map((sp, j) => (
                      <li key={j}>{sp}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}

        {tab === "Exam Q&A" && <ExamQA items={qa} />}

        {tab === "Sections" && (
          <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {sections.map((s) => (
              <li key={s.id}>
                <Link
                  to={`/section/${s.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
                >
                  <span>
                    <span className="font-semibold text-indigo-700">
                      s.{s.number}
                    </span>{" "}
                    <span className="text-slate-800">{s.title}</span>
                  </span>
                  {s.verification.status === "unverified" && (
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                      unverified
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

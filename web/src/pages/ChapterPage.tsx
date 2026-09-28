import { lazy, Suspense, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getChapter, getMCQs, getQA, getSections } from "../lib/content";
import ExamQA from "../features/ExamQA";
import MCQQuiz from "../features/MCQQuiz";

// MindMap pulls in markmap + d3 (heavy); lazy-load so it code-splits out of
// the initial bundle and only loads when the Mind Map tab is opened.
const MindMap = lazy(() => import("../features/MindMap"));

const TABS = [
  "Mind Map",
  "Summary",
  "Key Points",
  "Fast Revision",
  "Practice (MCQ)",
  "Exam Q&A",
  "Sections",
] as const;
type Tab = (typeof TABS)[number];

export default function ChapterPage() {
  const { id = "" } = useParams();
  const [searchParams] = useSearchParams();
  const chapter = getChapter(id);

  // Allow deep-linking to a specific tab (e.g. ?tab=Sections from a section's
  // "Back to sections" button).
  const initialTab = (TABS as readonly string[]).includes(
    searchParams.get("tab") ?? "",
  )
    ? (searchParams.get("tab") as Tab)
    : "Summary";
  const [tab, setTab] = useState<Tab>(initialTab);

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
  const mcqs = getMCQs(chapter.id);

  return (
    <div>
      <nav className="text-sm text-slate-500">
        <Link to="/" className="transition hover:text-indigo-600">
          Course Map
        </Link>{" "}
        <span className="text-slate-300">/</span> Chapter {chapter.number}
      </nav>

      {/* Chapter header banner */}
      <div className="mt-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-sm">
        <p className="text-sm font-medium text-indigo-100">
          Chapter {chapter.number} · Sections {chapter.sectionRange}
        </p>
        <h1 className="mt-1 text-3xl font-bold">{chapter.title}</h1>
        <p className="mt-2 max-w-2xl text-indigo-100">
          {chapter.shortDescription}
        </p>
      </div>

      {/* Tabs */}
      <div
        className="mt-5 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Chapter study views"
      >
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === t
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
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
          <article className="max-w-3xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 leading-relaxed text-slate-700 shadow-sm">
            {chapter.summary.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </article>
        )}

        {tab === "Key Points" && (
          <ul className="grid max-w-3xl gap-3">
            {chapter.keyPoints.map((kp, i) => (
              <li
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="flex items-start gap-2 font-semibold text-slate-900">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs text-indigo-700">
                    {i + 1}
                  </span>
                  {kp.point}
                </p>
                {kp.subPoints.length > 0 && (
                  <ul className="mt-2 space-y-1 pl-7 text-sm text-slate-600">
                    {kp.subPoints.map((sp, j) => (
                      <li key={j} className="list-disc">
                        {sp}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}

        {tab === "Fast Revision" && (
          <div className="max-w-3xl">
            <div className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200">
              ⚡ Last-minute must-know points. Skim these right before the exam.
            </div>
            <ol className="grid gap-2 sm:grid-cols-2">
              {chapter.fastRevision.map((point, i) => (
                <li
                  key={i}
                  className="flex gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm"
                >
                  <span className="font-semibold text-indigo-600">{i + 1}.</span>
                  {point}
                </li>
              ))}
            </ol>
          </div>
        )}

        {tab === "Practice (MCQ)" && <MCQQuiz items={mcqs} />}

        {tab === "Exam Q&A" && <ExamQA items={qa} />}

        {tab === "Sections" && (
          <ul className="grid max-w-3xl gap-2">
            {sections.map((s) => (
              <li key={s.id}>
                <Link
                  to={`/section/${s.id}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50/40"
                >
                  <span>
                    <span className="font-semibold text-indigo-700">
                      s.{s.number}
                    </span>{" "}
                    <span className="text-slate-800">{s.title}</span>
                  </span>
                  {s.verification.status === "unverified" && (
                    <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
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

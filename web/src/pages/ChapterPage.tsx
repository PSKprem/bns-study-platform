import { lazy, Suspense, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  getChapter,
  getChapterTerms,
  getMCQs,
  getQA,
  getSections,
} from "../lib/content";
import {
  chapterPath,
  CHAPTER_TABS,
  panelId,
  parseChapterTab,
  tabId,
  type ChapterTab,
} from "../lib/routes";
import { chapterReadFraction, setLastVisited } from "../lib/progress";
import { useProgress } from "../lib/useProgress";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import ExamQA from "../features/ExamQA";
import MCQQuiz from "../features/MCQQuiz";
import TermList from "../components/TermList";
import ChapterTabs from "../components/ChapterTabs";
import SectionGroups from "../components/SectionGroups";
import ReportIssueLink from "../components/ReportIssueLink";
import NotFound from "./NotFound";

// MindMap pulls in markmap + d3 (heavy); lazy-load so it code-splits out of
// the initial bundle and only loads when the Mind Map tab is opened.
const MindMap = lazy(() => import("../features/MindMap"));

export default function ChapterPage() {
  const { id = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const chapter = getChapter(id);
  const progress = useProgress();

  // The active tab lives in the URL (?tab=), so it survives refresh/back and can
  // be deep-linked (e.g. search results open the Exam Q&A tab directly).
  const tab = parseChapterTab(searchParams.get("tab"));
  const tabLabel = CHAPTER_TABS.find((t) => t.slug === tab)?.label ?? "";

  useDocumentTitle(
    chapter ? `Chapter ${chapter.number}: ${chapter.title} — ${tabLabel}` : "Chapter not found",
  );

  useEffect(() => {
    if (chapter) {
      setLastVisited(chapterPath(chapter.id, tab), `Chapter ${chapter.number}: ${chapter.title}`);
    }
  }, [chapter, tab]);

  if (!chapter) return <NotFound what="Chapter" />;

  const sections = getSections(chapter.id);
  const qa = getQA(chapter.id);
  const mcqs = getMCQs(chapter.id);
  const terms = getChapterTerms(chapter.id);
  const readPct = Math.round(
    chapterReadFraction(sections.map((s) => s.id), progress) * 100,
  );
  const best = progress.mcqBest[chapter.id];

  function selectTab(next: ChapterTab) {
    setSearchParams(next === "summary" ? {} : { tab: next }, { replace: true });
  }

  return (
    <div>
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
        <Link to="/" className="transition hover:text-indigo-600">
          Course Map
        </Link>{" "}
        <span aria-hidden="true" className="text-slate-300">/</span> Chapter {chapter.number}
      </nav>

      {/* Chapter header banner */}
      <div className="mt-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-sm">
        <p className="text-sm font-medium text-indigo-100">
          Chapter {chapter.number} · Sections {chapter.sectionRange}
        </p>
        <h1 className="mt-1 text-3xl font-bold">{chapter.title}</h1>
        <p className="mt-2 max-w-2xl text-indigo-100">{chapter.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full bg-white/15 px-3 py-1">
            {readPct}% of sections read
          </span>
          {best && (
            <span className="rounded-full bg-white/15 px-3 py-1">
              Best MCQ score: {best.score}/{best.total}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5">
        <ChapterTabs active={tab} onChange={selectTab} />
      </div>

      <div
        role="tabpanel"
        id={panelId(tab)}
        aria-labelledby={tabId(tab)}
        tabIndex={0}
        className="mt-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
      >
        {tab === "mind-map" && (
          <Suspense
            fallback={<p className="text-sm text-slate-500">Loading mind map…</p>}
          >
            <MindMap markdown={chapter.mindMap} />
          </Suspense>
        )}

        {tab === "summary" && (
          <article className="max-w-3xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 leading-relaxed text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {chapter.summary.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </article>
        )}

        {tab === "key-points" && (
          <ol className="grid max-w-3xl gap-3">
            {chapter.keyPoints.map((kp, i) => (
              <li
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <p className="flex items-start gap-2 font-semibold text-slate-900 dark:text-slate-100">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                  >
                    {i + 1}
                  </span>
                  {kp.point}
                </p>
                {kp.subPoints.length > 0 && (
                  <ul className="mt-2 space-y-1 pl-7 text-sm text-slate-600 dark:text-slate-400">
                    {kp.subPoints.map((sp, j) => (
                      <li key={j} className="list-disc">
                        {sp}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        )}

        {tab === "revision" && (
          <div className="max-w-3xl">
            <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900">
              <span aria-hidden="true">⚡ </span>Last-minute must-know points. Skim
              these right before the exam.
            </p>
            <ol className="grid gap-2 sm:grid-cols-2">
              {chapter.fastRevision.map((point, i) => (
                <li
                  key={i}
                  className="flex gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                >
                  <span aria-hidden="true" className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {i + 1}.
                  </span>
                  {point}
                </li>
              ))}
            </ol>
          </div>
        )}

        {tab === "mcq" && <MCQQuiz items={mcqs} chapterId={chapter.id} />}

        {tab === "qa" && <ExamQA items={qa} />}

        {tab === "sections" && (
          <SectionGroups sections={sections} subHeadings={chapter.subHeadings} />
        )}

        {tab === "dictionary" && (
          <div className="max-w-3xl">
            <p className="mb-4 rounded-xl bg-indigo-50 p-3 text-sm text-indigo-800 ring-1 ring-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-200 dark:ring-indigo-900">
              <span aria-hidden="true">📖 </span>Terms relevant to this chapter, in
              English and Hindi. For all terms across the book, see the{" "}
              <Link to="/dictionary" className="font-semibold underline">
                full Dictionary
              </Link>
              .
            </p>
            {terms.length > 0 ? (
              <TermList terms={terms} />
            ) : (
              <p className="text-slate-500 dark:text-slate-400">
                No dictionary terms linked to this chapter yet.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-10">
        <ReportIssueLink label={`Chapter ${chapter.number}: ${chapter.title} (${tabLabel})`} />
      </div>
    </div>
  );
}

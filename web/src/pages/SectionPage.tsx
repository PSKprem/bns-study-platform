import { useEffect, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { getChapter, getSection, getSections, getTerm } from "../lib/content";
import { chapterPath, sectionPath, termPath } from "../lib/routes";
import { setLastVisited, setSectionRead } from "../lib/progress";
import { actParagraphs } from "../lib/format";
import { useProgress } from "../lib/useProgress";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import VerificationBadge from "../components/VerificationBadge";
import ReportIssueLink from "../components/ReportIssueLink";
import NotFound from "./NotFound";

export default function SectionPage() {
  const { id = "" } = useParams();
  const section = getSection(id);
  const isRead = useProgress().readSections.includes(id);

  useDocumentTitle(
    section ? `Section ${section.number}: ${section.title}` : "Section not found",
  );

  useEffect(() => {
    if (section) {
      setLastVisited(sectionPath(section.id), `Section ${section.number}: ${section.title}`);
    }
  }, [section]);

  if (!section) return <NotFound what="Section" />;

  const chapter = getChapter(section.chapterId);
  const siblings = getSections(section.chapterId);
  const index = siblings.findIndex((s) => s.id === section.id);
  const prev = siblings[index - 1];
  const next = siblings[index + 1];
  // Back to the chapter's Sections tab (not the chapter top) so the student
  // can pick another section immediately.
  const backToSections = chapterPath(section.chapterId, "sections");

  return (
    <div className="max-w-3xl text-slate-700 dark:text-slate-300">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center justify-between gap-2">
        <Link
          to={backToSections}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800"
        >
          <span aria-hidden="true">←</span> Back to sections
          {chapter && <span className="sr-only"> of Chapter {chapter.number}</span>}
        </Link>
        <Link to="/" className="text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400">
          Course Map
        </Link>
      </nav>

      <div className="mt-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-sm">
        <p className="text-sm font-medium text-indigo-100">
          {chapter ? `Chapter ${chapter.number} · ` : ""}Section {section.number}
        </p>
        <h1 className="mt-1 text-2xl font-bold">{section.title}</h1>
      </div>

      <div className="mt-4">
        <VerificationBadge verification={section.verification} lastVerified={section.lastVerified} />
      </div>

      <Field label="Bare Act text">
        <div className="space-y-2 leading-relaxed">
          {actParagraphs(section.bareActText).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Field>

      <Field label="Plain-language meaning">
        <p>{section.plainMeaning}</p>
      </Field>

      {section.ingredients.length > 0 && (
        <Field label="Ingredients / essentials">
          <ol className="list-decimal space-y-1 pl-5">
            {section.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ol>
        </Field>
      )}

      <Field label="Punishment">
        <p>{section.punishment}</p>
      </Field>

      {section.classification && (
        <Field label="Classification">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt className="font-medium">Cognizable</dt>
            <dd>{section.classification.cognizable}</dd>
            <dt className="font-medium">Bailable</dt>
            <dd>{section.classification.bailable}</dd>
            <dt className="font-medium">Compoundable</dt>
            <dd>{section.classification.compoundable}</dd>
            <dt className="font-medium">Triable by</dt>
            <dd>{section.classification.triableBy}</dd>
          </dl>
        </Field>
      )}

      {section.ipcReference && (
        <Field label="IPC cross-reference">
          <p>
            {section.ipcReference.section} — {section.ipcReference.changeNote}
          </p>
        </Field>
      )}

      {section.illustrations.length > 0 && (
        <Field label="Worked examples">
          <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
            Original examples to help you apply the section. The Act's own
            illustrations, where it has them, are part of the bare Act text above.
          </p>
          <ul className="space-y-2">
            {section.illustrations.map((ill, i) => (
              <li
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900"
              >
                {ill}
              </li>
            ))}
          </ul>
        </Field>
      )}

      {section.termRefs.length > 0 && (
        <Field label="Key terms">
          <ul className="flex flex-wrap gap-2">
            {section.termRefs.map((ref) => {
              const term = getTerm(ref);
              return (
                <li key={ref}>
                  <Link
                    to={termPath(ref)}
                    className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900"
                  >
                    {term ? term.term : ref}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Field>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          aria-pressed={isRead}
          onClick={() => setSectionRead(section.id, !isRead)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition ${
            isRead
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800"
          }`}
        >
          {isRead ? "✓ Marked as read" : "Mark as read"}
        </button>
        <Link
          to={backToSections}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <span aria-hidden="true">←</span> Back to sections
        </Link>
      </div>

      <nav aria-label="Section navigation" className="mt-6 flex justify-between gap-3 text-sm">
        {prev ? (
          <Link to={sectionPath(prev.id)} className="text-indigo-700 hover:underline dark:text-indigo-300">
            ← s.{prev.number} {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={sectionPath(next.id)} className="text-right text-indigo-700 hover:underline dark:text-indigo-300">
            s.{next.number} {next.title} →
          </Link>
        )}
      </nav>

      <div className="mt-10">
        <ReportIssueLink label={`Section ${section.number}: ${section.title}`} />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </h2>
      <div className="mt-1">{children}</div>
    </section>
  );
}

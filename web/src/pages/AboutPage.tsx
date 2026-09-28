import { Link } from "react-router-dom";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { REPO_URL, SUGGESTION_URL, reportIssueUrl } from "../lib/site";
import { resetProgress } from "../lib/progress";

const STEPS = [
  ["Summary", "Read the plain-language overview to understand what the chapter does."],
  ["Key Points & Mind Map", "See the structure: main points, sub-points, and how they connect."],
  ["Sections", "Read the bare Act text, its plain meaning, ingredients and worked examples. Mark each section as read."],
  ["Practice (MCQ)", "Test yourself. Your best score is saved on this device."],
  ["Exam Q&A", "Try answering in Learn mode before revealing the model answer."],
  ["Fast Revision", "Skim the one-line must-know points just before the exam."],
  ["Dictionary", "Look up any hard term in English and Hindi."],
] as const;

export default function AboutPage() {
  useDocumentTitle("About & how to use");

  function onReset() {
    if (window.confirm("Clear your read sections and MCQ scores on this device?")) {
      resetProgress();
    }
  }

  return (
    <div className="max-w-3xl space-y-8 text-slate-700 dark:text-slate-300">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          About & how to use
        </h1>
        <p className="mt-2">
          A free, student-first study companion for the Bharatiya Nyaya Sanhita,
          2023 (BNS) — India's penal code that replaced the IPC. It is built to help
          you understand, remember and revise, not just look things up.
        </p>
      </header>

      <section aria-labelledby="how">
        <h2 id="how" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          A study routine that works
        </h2>
        <ol className="mt-3 space-y-2">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="flex gap-3">
              <span
                aria-hidden="true"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
              >
                {i + 1}
              </span>
              <span>
                <strong className="text-slate-900 dark:text-slate-100">{title}:</strong> {text}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="sources">
        <h2 id="sources" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Accuracy and sources
        </h2>
        <p className="mt-2">
          The bare Act text of every published section is checked word for word
          against the official Gazette of India (Extraordinary, Part II Section 1,
          Act No. 45 of 2023, dated 25 December 2023). Each section shows its
          verification status and date. Explanations, examples and questions are
          original writing, not copied from any commentary.
        </p>
      </section>

      <section
        aria-labelledby="disclaimer"
        className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:ring-amber-900"
      >
        <h2 id="disclaimer" className="font-semibold text-amber-900 dark:text-amber-200">
          Disclaimer
        </h2>
        <p className="mt-1 text-sm text-amber-900 dark:text-amber-200">
          This is a study aid, not legal advice. Laws are amended and courts
          interpret them; always rely on the official text and a qualified lawyer
          for real matters. Punishment and procedure details for offences also depend
          on the BNSS, 2023.
        </p>
      </section>

      <section aria-labelledby="feedback">
        <h2 id="feedback" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Found a mistake? Have an idea?
        </h2>
        <p className="mt-2">
          Readers catching errors make this better for everyone. Every chapter and
          section page has a "Report it" link that opens a pre-filled GitHub issue.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <a
            href={reportIssueUrl("General", "/about")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
          >
            Report an error<span className="sr-only"> (opens GitHub in a new tab)</span>
          </a>
          <a
            href={SUGGESTION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-4 py-2 font-semibold text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50 dark:text-indigo-300 dark:ring-indigo-800 dark:hover:bg-slate-800"
          >
            Suggest a feature<span className="sr-only"> (opens GitHub in a new tab)</span>
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-2 text-slate-600 underline dark:text-slate-400"
          >
            Source code<span className="sr-only"> (opens GitHub in a new tab)</span>
          </a>
        </div>
      </section>

      <section aria-labelledby="privacy">
        <h2 id="privacy" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Your data
        </h2>
        <p className="mt-2">
          There are no accounts. Your theme, read sections and best quiz scores are
          stored only in this browser. Nothing is sent to a server.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-3 rounded-lg px-4 py-2 text-sm font-medium text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50 dark:text-rose-300 dark:ring-rose-900 dark:hover:bg-slate-800"
        >
          Reset my progress
        </button>
      </section>

      <p>
        <Link to="/" className="font-medium text-indigo-700 underline dark:text-indigo-300">
          Go to the course map
        </Link>
      </p>
    </div>
  );
}

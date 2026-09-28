import { useState } from "react";
import type { ExamQA } from "../types/content";

type Mode = "learn" | "read";

// Exam Q&A with two modes (FR-5):
//  - Learn: answer hidden until revealed (active recall), optional typing
//  - Read:  answer shown with the question (fast revision)
export default function ExamQA({ items }: { items: ExamQA[] }) {
  const [mode, setMode] = useState<Mode>("learn");

  if (items.length === 0) {
    return <p className="text-slate-500">No questions yet for this chapter.</p>;
  }

  return (
    <div>
      <div
        className="mb-4 inline-flex rounded-md border border-slate-200 bg-white p-0.5 text-sm"
        role="tablist"
        aria-label="Question mode"
      >
        <button
          role="tab"
          aria-selected={mode === "learn"}
          onClick={() => setMode("learn")}
          className={`rounded px-3 py-1 ${
            mode === "learn"
              ? "bg-indigo-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Learn (self-test)
        </button>
        <button
          role="tab"
          aria-selected={mode === "read"}
          onClick={() => setMode("read")}
          className={`rounded px-3 py-1 ${
            mode === "read"
              ? "bg-indigo-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Read
        </button>
      </div>

      <ol className="space-y-4">
        {items.map((q, i) => (
          <QACard key={q.id} qa={q} index={i + 1} mode={mode} />
        ))}
      </ol>
    </div>
  );
}

function QACard({
  qa,
  index,
  mode,
}: {
  qa: ExamQA;
  index: number;
  mode: Mode;
}) {
  const [revealed, setRevealed] = useState(false);
  const showAnswer = mode === "read" || revealed;

  return (
    <li className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium text-slate-900">
          {index}. {qa.question}
        </p>
        <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-500">
          {qa.difficulty}
        </span>
      </div>

      {mode === "learn" && (
        <div className="mt-3">
          <label className="text-xs text-slate-500" htmlFor={`ans-${qa.id}`}>
            Try answering first (optional):
          </label>
          <textarea
            id={`ans-${qa.id}`}
            rows={2}
            className="mt-1 w-full rounded border border-slate-200 p-2 text-sm"
            placeholder="Type your answer..."
          />
          {!revealed && (
            <button
              onClick={() => setRevealed(true)}
              className="mt-2 rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
            >
              Reveal model answer
            </button>
          )}
        </div>
      )}

      {showAnswer && (
        <div className="mt-3 rounded bg-slate-50 p-3 text-sm text-slate-700">
          <p className="mb-1 font-semibold text-slate-800">Model answer</p>
          {qa.modelAnswer}
        </div>
      )}
    </li>
  );
}

import { useState } from "react";
import type { MCQ } from "../types/content";
import { recordMcqScore } from "../lib/progress";
import { useProgress } from "../lib/useProgress";

// MCQ practice: active testing (the strongest learning method). The student
// picks an option and gets instant right/wrong feedback plus an explanation.
// The best score per chapter is kept on-device.
export default function MCQQuiz({
  items,
  chapterId,
}: {
  items: MCQ[];
  chapterId: string;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [finished, setFinished] = useState(false);
  const [newBest, setNewBest] = useState(false);
  const best = useProgress().mcqBest[chapterId];

  if (items.length === 0) {
    return <p className="text-slate-500">No practice questions yet.</p>;
  }

  const q = items[index];
  const isLast = index === items.length - 1;

  function choose(i: number) {
    if (selected !== null) return; // already answered this question
    setSelected(i);
    setAnswered((a) => a + 1);
    if (i === q.correctIndex) setScore((s) => s + 1);
  }

  function nextQuestion() {
    if (isLast) {
      setNewBest(recordMcqScore(chapterId, score, items.length));
      setFinished(true);
      return;
    }
    setIndex((n) => n + 1);
    setSelected(null);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setAnswered(0);
    setFinished(false);
    setNewBest(false);
  }

  if (finished) {
    const pct = Math.round((score / items.length) * 100);
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Quiz complete</p>
        <p className="mt-2 text-4xl font-bold text-indigo-600 dark:text-indigo-400">
          {score} / {items.length}
        </p>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{pct}% correct</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300" role="status">
          {newBest
            ? "New best score for this chapter!"
            : best && `Your best: ${best.score} / ${best.total}`}
        </p>
        <button
          onClick={restart}
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>
          Question {index + 1} of {items.length}
        </span>
        <span>
          Score: <span className="font-semibold text-slate-700 dark:text-slate-200">{score}</span>
          {answered > 0 && ` / ${answered}`}
        </span>
      </div>

      {/* progress bar */}
      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{ width: `${((index + 1) / items.length) * 100}%` }}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{q.question}</p>

        <div className="mt-4 space-y-2">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex;
            const isChosen = i === selected;
            const show = selected !== null;

            let cls =
              "w-full rounded-xl border px-4 py-3 text-left text-sm transition ";
            if (!show) {
              cls +=
                "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:bg-slate-800";
            } else if (isCorrect) {
              cls += "border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300";
            } else if (isChosen) {
              cls += "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300";
            } else {
              cls += "border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500";
            }

            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={show}
                className={cls}
              >
                <span className="mr-2 font-semibold">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
                {show && isCorrect && <span className="ml-2">✓</span>}
                {show && isChosen && !isCorrect && (
                  <span className="ml-2">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-slate-100">
              {selected === q.correctIndex ? "Correct!" : "Not quite."}
            </p>
            <p className="mt-1">{q.explanation}</p>
          </div>
        )}

        {selected !== null && (
          <button
            onClick={nextQuestion}
            className="mt-5 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            {isLast ? "See results" : "Next question →"}
          </button>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { getChapters, getFlashcards } from "../lib/content";
import { getCardStatus, setCardStatus, type CardStatus } from "../lib/progress";

export default function FlashcardsPage() {
  // For the first milestone there is one chapter; default to it.
  const chapters = getChapters();
  const [chapterId] = useState(chapters[0]?.id ?? "");
  const cards = getFlashcards(chapterId);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  // Force re-render after status change.
  const [, setTick] = useState(0);

  if (cards.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Flashcards</h1>
        <p className="mt-2 text-slate-500">No flashcards yet.</p>
      </div>
    );
  }

  const card = cards[index];
  const status = getCardStatus(card.id);

  function mark(s: CardStatus) {
    setCardStatus(card.id, s);
    setTick((t) => t + 1);
    next();
  }

  function next() {
    setFlipped(false);
    setIndex((i) => (i + 1) % cards.length);
  }

  const knownCount = cards.filter(
    (c) => getCardStatus(c.id) === "known",
  ).length;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-slate-900">Flashcards</h1>
      <p className="mt-1 text-sm text-slate-500">
        Card {index + 1} of {cards.length} · Known: {knownCount}/{cards.length}
      </p>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="mt-4 flex min-h-40 w-full items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center text-lg text-slate-800 shadow-sm transition hover:border-indigo-300"
        aria-label="Flip card"
      >
        {flipped ? card.back : card.front}
      </button>
      <p className="mt-1 text-center text-xs text-slate-400">
        {flipped ? "Answer" : "Question"} — click to flip
        {status ? ` · marked ${status}` : ""}
      </p>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => mark("unknown")}
          className="flex-1 rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
        >
          Still learning
        </button>
        <button
          onClick={() => mark("known")}
          className="flex-1 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
        >
          I know this
        </button>
      </div>

      <button
        onClick={next}
        className="mt-3 w-full rounded-md px-4 py-2 text-sm text-slate-500 hover:bg-slate-100"
      >
        Skip →
      </button>
    </div>
  );
}

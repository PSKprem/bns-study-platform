import { useSearchParams } from "react-router-dom";
import { getDictionary } from "../lib/content";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import TermList from "../components/TermList";

export default function DictionaryPage() {
  useDocumentTitle("Dictionary");
  const terms = getDictionary();
  // ?term=<id> (from section term chips and search results) scrolls to that term.
  const highlightId = useSearchParams()[0].get("term") ?? undefined;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dictionary</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Difficult and legal terms from across the book, explained in English and
        Hindi. {terms.length} terms.
      </p>
      <div className="mt-5">
        <TermList terms={terms} highlightId={highlightId} />
      </div>
    </div>
  );
}

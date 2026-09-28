import { getDictionary } from "../lib/content";
import TermList from "../components/TermList";

export default function DictionaryPage() {
  const terms = getDictionary();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dictionary</h1>
      <p className="mt-1 text-sm text-slate-500">
        Difficult and legal terms from across the book, explained in English and
        Hindi. {terms.length} terms.
      </p>
      <div className="mt-5">
        <TermList terms={terms} />
      </div>
    </div>
  );
}

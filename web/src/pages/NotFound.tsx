import { Link } from "react-router-dom";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export default function NotFound({ what = "Page" }: { what?: string }) {
  useDocumentTitle(`${what} not found`);
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {what} not found
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        The link may be outdated, or this content hasn't been added yet.
      </p>
      <Link
        to="/"
        className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Back to course map
      </Link>
    </div>
  );
}

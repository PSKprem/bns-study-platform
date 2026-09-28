import { useLocation } from "react-router-dom";
import { reportIssueUrl } from "../lib/site";

// Lets a student report a mistake on the exact page they are reading.
// Opens a pre-filled GitHub issue in a new tab.
export default function ReportIssueLink({ label }: { label: string }) {
  const { pathname, search } = useLocation();
  return (
    <a
      href={reportIssueUrl(label, pathname + search)}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-slate-500 underline-offset-2 hover:text-indigo-600 hover:underline dark:text-slate-400"
    >
      Spotted a mistake? Report it<span className="sr-only"> (opens GitHub in a new tab)</span>
    </a>
  );
}

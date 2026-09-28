import { Link, useNavigate, useParams } from "react-router-dom";
import { getSection, getTerm } from "../lib/content";
import VerificationBadge from "../components/VerificationBadge";

export default function SectionPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const section = getSection(id);

  if (!section) {
    return (
      <div>
        <p className="text-slate-600">Section not found.</p>
        <Link to="/" className="text-indigo-700 underline">
          Back to course map
        </Link>
      </div>
    );
  }

  // Back to the chapter's Sections tab (not the chapter top) so the student
  // can pick another section immediately (user feedback fix).
  const backToSections = `/chapter/${section.chapterId}?tab=Sections`;

  return (
    <div className="max-w-3xl dark:text-slate-300">
      {/* Prominent back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(backToSections)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800"
        >
          <span aria-hidden>←</span> Back to sections
        </button>
        <Link
          to="/"
          className="text-sm text-slate-400 transition hover:text-indigo-600 dark:text-slate-500"
        >
          Course Map
        </Link>
      </div>

      <div className="mt-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-sm">
        <p className="text-sm font-medium text-indigo-100">
          Section {section.number}
        </p>
        <h1 className="mt-1 text-2xl font-bold">{section.title}</h1>
      </div>

      <div className="mt-4">
        <VerificationBadge
          verification={section.verification}
          lastVerified={section.lastVerified}
        />
      </div>

      <Field label="Bare Act text">
        <p className="whitespace-pre-line leading-relaxed text-slate-700">
          {section.bareActText}
        </p>
      </Field>

      <Field label="Plain-language meaning">
        <p className="text-slate-700">{section.plainMeaning}</p>
      </Field>

      {section.ingredients.length > 0 && (
        <Field label="Ingredients / essentials">
          <ul className="list-decimal space-y-1 pl-5 text-slate-700">
            {section.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </Field>
      )}

      <Field label="Punishment">
        <p className="text-slate-700">{section.punishment}</p>
      </Field>

      {section.classification && (
        <Field label="Classification">
          <ul className="text-slate-700">
            <li>Cognizable: {section.classification.cognizable}</li>
            <li>Bailable: {section.classification.bailable}</li>
            <li>Compoundable: {section.classification.compoundable}</li>
            <li>Triable by: {section.classification.triableBy}</li>
          </ul>
        </Field>
      )}

      {section.ipcReference && (
        <Field label="IPC cross-reference">
          <p className="text-slate-700">
            {section.ipcReference.section} — {section.ipcReference.changeNote}
          </p>
        </Field>
      )}

      {section.illustrations.length > 0 && (
        <Field label="Illustrations">
          <ul className="list-disc space-y-1 pl-5 text-slate-700">
            {section.illustrations.map((ill, i) => (
              <li key={i}>{ill}</li>
            ))}
          </ul>
        </Field>
      )}

      {section.termRefs.length > 0 && (
        <Field label="Key terms">
          <div className="flex flex-wrap gap-2">
            {section.termRefs.map((ref) => {
              const term = getTerm(ref);
              return (
                <Link
                  key={ref}
                  to="/dictionary"
                  className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900"
                >
                  {term ? term.term : ref}
                </Link>
              );
            })}
          </div>
        </Field>
      )}

      {/* Bottom back button too, for long pages */}
      <div className="mt-8">
        <button
          onClick={() => navigate(backToSections)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <span aria-hidden>←</span> Back to sections
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </h2>
      <div className="mt-1">{children}</div>
    </section>
  );
}

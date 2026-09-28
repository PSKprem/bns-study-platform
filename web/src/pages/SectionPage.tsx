import { Link, useParams } from "react-router-dom";
import { getSection, getTerm } from "../lib/content";
import VerificationBadge from "../components/VerificationBadge";

export default function SectionPage() {
  const { id = "" } = useParams();
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

  return (
    <div className="max-w-3xl">
      <nav className="text-sm text-slate-500">
        <Link to="/" className="hover:underline">
          Course Map
        </Link>{" "}
        /{" "}
        <Link to={`/chapter/${section.chapterId}`} className="hover:underline">
          Chapter
        </Link>{" "}
        / Section {section.number}
      </nav>

      <h1 className="mt-1 text-2xl font-bold text-slate-900">
        Section {section.number} — {section.title}
      </h1>

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
          <ul className="list-decimal pl-5 text-slate-700">
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
          <ul className="list-disc pl-5 text-slate-700">
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
                  className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700 hover:bg-indigo-100"
                >
                  {term ? term.term : ref}
                </Link>
              );
            })}
          </div>
        </Field>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </h2>
      <div className="mt-1">{children}</div>
    </section>
  );
}

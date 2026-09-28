import { Link } from "react-router-dom";
import type { Section, SubHeading } from "../types/content";
import { sectionPath } from "../lib/routes";
import { useProgress } from "../lib/useProgress";

// Sections grouped under the chapter's own sub-headings (FR-1.3), so dense
// chapters read as a few clusters instead of one long list. Any section not
// listed under a sub-heading is shown in an "Other sections" group.
export default function SectionGroups({
  sections,
  subHeadings,
}: {
  sections: Section[];
  subHeadings: SubHeading[];
}) {
  const read = new Set(useProgress().readSections);
  const byId = new Map(sections.map((s) => [s.id, s]));
  const grouped = new Set(subHeadings.flatMap((g) => g.sectionIds));
  const groups = [
    ...subHeadings.map((g) => ({
      id: g.id,
      label: g.label,
      items: g.sectionIds.map((id) => byId.get(id)).filter((s): s is Section => !!s),
    })),
    {
      id: "other",
      label: "Other sections",
      items: sections.filter((s) => !grouped.has(s.id)),
    },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="max-w-3xl space-y-6">
      {groups.map((g) => (
        <section key={g.id} aria-labelledby={`group-${g.id}`}>
          <h3
            id={`group-${g.id}`}
            className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
          >
            {g.label}
          </h3>
          <ul className="grid gap-2">
            {g.items.map((s) => {
              const isRead = read.has(s.id);
              return (
                <li key={s.id}>
                  <Link
                    to={sectionPath(s.id)}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700 dark:hover:bg-slate-800"
                  >
                    <span>
                      <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                        s.{s.number}
                      </span>{" "}
                      <span className="text-slate-800 dark:text-slate-200">{s.title}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {s.verification.status === "unverified" && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                          unverified
                        </span>
                      )}
                      {isRead && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-950/50 dark:text-green-300">
                          <span aria-hidden="true">✓ </span>Read
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

import { useRef, type KeyboardEvent } from "react";
import { CHAPTER_TABS, panelId, tabId, type ChapterTab } from "../lib/routes";

// WAI-ARIA tabs pattern: one tab stop, arrow keys / Home / End move between
// tabs, each tab is linked to its panel. The strip scrolls sideways on phones
// instead of wrapping into several rows.
export default function ChapterTabs({
  active,
  onChange,
}: {
  active: ChapterTab;
  onChange: (tab: ChapterTab) => void;
}) {
  const refs = useRef<Partial<Record<ChapterTab, HTMLButtonElement | null>>>({});

  function focusAndSelect(index: number) {
    const tab = CHAPTER_TABS[(index + CHAPTER_TABS.length) % CHAPTER_TABS.length];
    onChange(tab.slug);
    refs.current[tab.slug]?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: CHAPTER_TABS.length - 1,
    };
    if (e.key in keys) {
      e.preventDefault();
      focusAndSelect(keys[e.key]);
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Chapter study views"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
      {CHAPTER_TABS.map((t, i) => {
        const selected = t.slug === active;
        return (
          <button
            key={t.slug}
            ref={(el) => {
              refs.current[t.slug] = el;
            }}
            id={tabId(t.slug)}
            role="tab"
            type="button"
            aria-selected={selected}
            aria-controls={panelId(t.slug)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.slug)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
              selected
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

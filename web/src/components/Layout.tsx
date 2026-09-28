import { Link, NavLink, Outlet } from "react-router-dom";
import { useTheme } from "../lib/theme";
import { SUGGESTION_URL, reportIssueUrl } from "../lib/site";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/dictionary", label: "Dictionary" },
  { to: "/search", label: "Search" },
  { to: "/about", label: "About" },
];

export default function Layout() {
  const { theme, toggle } = useTheme();
  const themeLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <div className="flex min-h-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-indigo-700 focus:shadow"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white">
              BNS
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-slate-100">
              Study Platform
            </span>
          </Link>
          <nav aria-label="Main" className="flex items-center gap-1 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 transition-colors ${
                    isActive
                      ? "bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={toggle}
              aria-label={themeLabel}
              title={themeLabel}
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <span aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
            </button>
          </nav>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 outline-none">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 py-5 text-xs text-slate-600 dark:text-slate-400">
          <p>
            A learning companion for the Bharatiya Nyaya Sanhita, 2023. Bare Act
            text is government material, verified against the official Gazette;
            explanatory content is original. Study aid only — not legal advice.
          </p>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <Link to="/about" className="underline hover:text-indigo-600">
              About &amp; disclaimer
            </Link>
            <a
              href={reportIssueUrl("General", "/")}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-indigo-600"
            >
              Report an error<span className="sr-only"> (opens GitHub in a new tab)</span>
            </a>
            <a
              href={SUGGESTION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-indigo-600"
            >
              Suggest a feature<span className="sr-only"> (opens GitHub in a new tab)</span>
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

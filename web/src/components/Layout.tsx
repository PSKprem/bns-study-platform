import { Link, NavLink, Outlet } from "react-router-dom";
import { useTheme } from "../lib/theme";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/dictionary", label: "Dictionary" },
  { to: "/search", label: "Search" },
];

export default function Layout() {
  const { theme, toggle } = useTheme();

  return (
    <div className="flex min-h-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white">
              BNS
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-slate-100">
              Study Platform
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
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
              onClick={toggle}
              aria-label={
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
              }
              title={
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
              }
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 py-5 text-xs text-slate-500 dark:text-slate-400">
          <p>
            A learning companion for the Bharatiya Nyaya Sanhita, 2023. Bare Act
            text is government material; explanatory content is original.
          </p>
          <p className="mt-1">
            Statute facts are verified against the official BNS 2023 Gazette.
            Not legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

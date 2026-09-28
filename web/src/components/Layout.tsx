import { Link, NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/dictionary", label: "Dictionary" },
  { to: "/search", label: "Search" },
];

export default function Layout() {
  return (
    <div className="flex min-h-full flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white">
              BNS
            </span>
            <span className="text-base font-bold text-slate-900">
              Study Platform
            </span>
          </Link>
          <nav className="flex gap-1 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 transition-colors ${
                    isActive
                      ? "bg-indigo-50 font-semibold text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-5 text-xs text-slate-500">
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

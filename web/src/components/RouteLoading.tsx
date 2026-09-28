// Shown on the very first load while a lazily loaded page chunk arrives,
// so students never see a blank screen.
export default function RouteLoading() {
  return (
    <div
      role="status"
      className="flex min-h-full items-center justify-center bg-slate-50 p-8 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400"
    >
      Loading…
    </div>
  );
}

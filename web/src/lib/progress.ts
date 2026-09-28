// On-device study progress, stored in localStorage (no accounts, no server —
// architecture §7). Components subscribe via useProgress() and re-render when
// progress changes in this tab or in another open tab.

export interface BestScore {
  score: number;
  total: number;
}

export interface LastVisited {
  path: string;
  label: string;
}

export interface Progress {
  /** Section ids the student has marked as read. */
  readSections: string[];
  /** Best MCQ score per chapter id. */
  mcqBest: Record<string, BestScore>;
  lastVisited: LastVisited | null;
}

const KEY = "bns:progress:v1";
const EMPTY: Progress = { readSections: [], mcqBest: {}, lastVisited: null };

/** Keeps only well-formed fields, so corrupt or old data can't break the UI. */
export function parseProgress(raw: string | null): Progress {
  if (!raw) return EMPTY;
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return EMPTY;
    const d = data as Record<string, unknown>;
    const readSections = Array.isArray(d.readSections)
      ? d.readSections.filter((x): x is string => typeof x === "string")
      : [];
    const mcqBest: Record<string, BestScore> = {};
    if (typeof d.mcqBest === "object" && d.mcqBest !== null) {
      for (const [k, v] of Object.entries(d.mcqBest as Record<string, unknown>)) {
        const s = v as Partial<BestScore> | null;
        if (s && typeof s.score === "number" && typeof s.total === "number") {
          mcqBest[k] = { score: s.score, total: s.total };
        }
      }
    }
    const lv = d.lastVisited as Partial<LastVisited> | null | undefined;
    const lastVisited =
      lv && typeof lv.path === "string" && typeof lv.label === "string"
        ? { path: lv.path, label: lv.label }
        : null;
    return { readSections, mcqBest, lastVisited };
  } catch {
    return EMPTY;
  }
}

// useSyncExternalStore needs a stable snapshot object, so parse once and
// cache until the stored string changes.
let cachedRaw: string | null | undefined;
let cachedValue: Progress = EMPTY;

export function getProgress(): Progress {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    // Storage unavailable (e.g. privacy mode): behave as empty.
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = parseProgress(raw);
  }
  return cachedValue;
}

const listeners = new Set<() => void>();

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function save(next: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Best-effort: progress simply isn't kept if storage is unavailable.
  }
  for (const l of listeners) l();
}

export function setSectionRead(sectionId: string, read: boolean): void {
  const p = getProgress();
  const set = new Set(p.readSections);
  if (read) set.add(sectionId);
  else set.delete(sectionId);
  save({ ...p, readSections: [...set] });
}

/** Records a quiz result; returns true if it is a new best score. */
export function recordMcqScore(chapterId: string, score: number, total: number): boolean {
  const p = getProgress();
  const prev = p.mcqBest[chapterId];
  const better = !prev || score / total > prev.score / prev.total;
  if (better) save({ ...p, mcqBest: { ...p.mcqBest, [chapterId]: { score, total } } });
  return better;
}

export function setLastVisited(path: string, label: string): void {
  const p = getProgress();
  if (p.lastVisited?.path === path) return;
  save({ ...p, lastVisited: { path, label } });
}

export function resetProgress(): void {
  save(EMPTY);
}

/** Fraction of a chapter's sections marked read, 0..1. */
export function chapterReadFraction(sectionIds: string[], progress: Progress): number {
  if (sectionIds.length === 0) return 0;
  const read = new Set(progress.readSections);
  return sectionIds.filter((id) => read.has(id)).length / sectionIds.length;
}

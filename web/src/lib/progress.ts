// Thin wrapper over localStorage for persisting user progress on-device.
// No accounts, no server — progress is local to the browser (architecture §7).

export type CardStatus = "known" | "unknown";

const KEY = "bns:flashcard-progress";

type ProgressMap = Record<string, CardStatus>;

function read(): ProgressMap {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function write(map: ProgressMap): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    // Ignore storage errors (e.g. private mode); progress is best-effort.
  }
}

export function getCardStatus(cardId: string): CardStatus | undefined {
  return read()[cardId];
}

export function setCardStatus(cardId: string, status: CardStatus): void {
  const map = read();
  map[cardId] = status;
  write(map);
}

export function getAllProgress(): ProgressMap {
  return read();
}

export function resetProgress(): void {
  write({});
}

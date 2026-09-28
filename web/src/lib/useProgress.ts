import { useSyncExternalStore } from "react";
import { getProgress, subscribe, type Progress } from "./progress";

/** Current study progress; re-renders whenever it changes (this tab or another). */
export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getProgress, getProgress);
}

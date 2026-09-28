import { useEffect } from "react";
import { SITE_NAME } from "./site";

/** Sets the browser tab title for the current page ("Page — BNS Study Platform"). */
export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  }, [title]);
}

// Site-wide constants: the public repository and feedback links.

export const SITE_NAME = "BNS Study Platform";
export const REPO_URL = "https://github.com/PSKprem/bns-study-platform";

/**
 * Link that opens a pre-filled GitHub issue, so students can report a mistake
 * on the exact page they are reading. The page is passed in, never user input.
 */
export function reportIssueUrl(pageLabel: string, pagePath: string): string {
  const params = new URLSearchParams({
    template: "content-error.yml",
    title: `[Content] ${pageLabel}`,
    page: pagePath,
  });
  return `${REPO_URL}/issues/new?${params.toString()}`;
}

export const SUGGESTION_URL = `${REPO_URL}/issues/new?template=suggestion.yml`;

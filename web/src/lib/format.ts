/**
 * Splits bare Act text into readable paragraphs: a new paragraph starts at each
 * numbered sub-section/clause ("(2) In every case…", "(10) “gender”…") and at
 * each Explanation or Illustration. Cross-references inside a sentence, such as
 * "sub-sections (2), (3), (4) and (5)", are not split, because a real
 * sub-section starts with a capital letter, a quote, or a nested "(a)".
 */
export function actParagraphs(text: string): string[] {
  return text
    .split(/\s+(?=\(\d{1,2}\)\s+[A-Z“"(]|Explanations?\b|Illustrations?\.)/)
    .map((p) => p.trim())
    .filter(Boolean);
}

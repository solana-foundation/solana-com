/**
 * Returns a string truncated to a given length with an optional postfix.
 */
export const truncateTextByWord = (
  text: string,
  truncateLength: number,
  append: string = "",
): string => {
  if (text.length <= truncateLength) {
    return text;
  }

  // Reserve room for the postfix so the result never exceeds truncateLength.
  const budget = truncateLength - append.length;

  if (budget <= 0) {
    return append.slice(0, truncateLength);
  }

  const clipped = text.slice(0, budget);
  // Prefer a word boundary, falling back to a hard clip when the first word is
  // already longer than the budget.
  const trimmed = clipped.replace(/\s+\S*$/, "") || clipped;

  return `${trimmed.trimEnd()}${append}`;
};

/**
 * Capitalizes first Char.
 */
export const capitalizeFirstChar = (str: string): string =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

/**
 * Capitalizes every word in a given string.
 */
export const capitalize = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));

/**
 * Checks if a given text is a string.
 */
export const isString = (text: unknown): boolean =>
  typeof text === "string" || text instanceof String;

/**
 * Takes a given title and converts it to a slug.
 */
export const createSlugFromTitle = (
  title: string,
  replacement: string = "",
): string => title.replace(/\s+/g, replacement).toLowerCase();

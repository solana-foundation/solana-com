/**
 * Returns a string truncated to a given length with an optional postfix.
 *
 * @param {string}        text              The text string to truncate.
 * @param {number}        truncateLength    To which length to truncate.
 * @param {string}        append            Postfix (e.g. Ellipsis).
 * @returns {string}
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
 *
 * @param {string}  str   Word to capitalize.
 * @returns {string}
 */
export const capitalizeFirstChar = (str: string): string =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

/**
 * Capitalizes every word in a given string.
 *
 * @param {string}      text    String to capitalize.
 * @returns {string}
 */
export const capitalize = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));

/**
 * Checks if a given text is a string.
 *
 * @param {unknown}   text  The text to check.
 * @returns {boolean}
 */
export const isString = (text: unknown): boolean =>
  typeof text === "string" || text instanceof String;

/**
 * Takes a given title and converts it to a slug.
 *
 * @param title
 * @param replacement
 * @returns {string}
 */
export const createSlugFromTitle = (title: string, replacement = ""): string =>
  title.replace(/\s+/g, replacement).toLowerCase();

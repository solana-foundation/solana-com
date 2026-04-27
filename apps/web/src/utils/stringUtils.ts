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
  append = "",
): string => {
  const textLength = text.length;
  const appendLength = append.length;

  if (
    textLength < truncateLength ||
    text.indexOf(" ") + appendLength > truncateLength
  ) {
    return text;
  }

  const newLength =
    textLength + appendLength > truncateLength
      ? truncateLength - appendLength
      : textLength;

  // Truncate string to new length & find last whitespace beforehand.
  const tempString = text.substring(0, newLength).replace(/\s+\S*$/, "");

  if (appendLength > 0) {
    return `${tempString} ${append}`;
  }
  return tempString;
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

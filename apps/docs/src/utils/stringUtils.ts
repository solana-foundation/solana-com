/**
 * Returns a string truncated to a given length with an optional postfix.
 */
export const truncateTextByWord = (
  text: string,
  truncateLength: number,
  append: string = "",
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

  const tempString = text.substring(0, newLength).replace(/\s+\S*$/, "");

  if (appendLength > 0) {
    return `${tempString} ${append}`;
  }
  return tempString;
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

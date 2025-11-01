import { AbstractIntlMessages } from "next-intl";

/**
 * Loads translation messages from a locale file with automatic fallback to English.
 *
 * @param importPath - A function that returns the dynamic import for the given locale
 * @param locale - The locale to load
 * @returns The loaded messages object
 */
export async function loadMessages(
  importPath: (locale: string) => Promise<{ default: AbstractIntlMessages }>,
  locale: string,
): Promise<AbstractIntlMessages> {
  try {
    return (await importPath(locale)).default;
  } catch {
    // Fallback to English if locale doesn't exist
    return (await importPath("en")).default;
  }
}

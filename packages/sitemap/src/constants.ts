import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export const SITE_URL = "https://solana.com";
export const DEFAULT_LOCALE = "en";
export const LOCALES = [
  "en",
  "ar",
  "de",
  "el",
  "es",
  "fi",
  "fr",
  "id",
  "it",
  "ja",
  "ko",
  "nl",
  "pl",
  "pt",
  "ru",
  "tr",
  "uk",
  "vi",
  "zh",
] as const;

export const repoRoot = path.resolve(currentDir, "..", "..", "..");

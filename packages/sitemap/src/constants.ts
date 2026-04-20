import path from "node:path";
import { fileURLToPath } from "node:url";
import { defaultLocale, locales } from "@workspace/i18n/config";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export const SITE_URL = "https://solana.com";
export const DEFAULT_LOCALE = defaultLocale;
export const LOCALES = locales;

export const repoRoot = path.resolve(currentDir, "..", "..", "..");

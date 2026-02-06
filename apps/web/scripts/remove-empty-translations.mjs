#!/usr/bin/env node
/**
 * Removes keys that have no content: null, empty string, or recursively empty
 * objects/arrays. Excludes the English (en) locale.
 *
 * Run from apps/web:
 *   node scripts/remove-empty-translations.mjs
 *
 * Optional: node scripts/remove-empty-translations.mjs --fallback-from-en
 *   replaces null/empty with English source instead of removing (for fallback UX).
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, "../public/locales");
const FALLBACK_FROM_EN = process.argv.includes("--fallback-from-en");

function isEmptyLeaf(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  return false;
}

/** Count empty leaves and empty structures (for logging). */
function countEmpty(obj) {
  if (obj === null || typeof obj !== "object") return isEmptyLeaf(obj) ? 1 : 0;
  if (Array.isArray(obj)) return obj.reduce((n, i) => n + countEmpty(i), 0);
  let n = 0;
  for (const value of Object.values(obj)) {
    n += countEmpty(value);
  }
  return n;
}

/**
 * Recursively remove keys with no content. Returns undefined for empty value
 * so the caller omits the key. Optionally fill from sourceEn when --fallback-from-en.
 */
function removeEmptyTranslations(obj, sourceEn = null) {
  // Leaf: null, undefined, or empty string → remove (or fallback)
  if (obj === null || obj === undefined) {
    if (FALLBACK_FROM_EN && sourceEn !== undefined && sourceEn !== null)
      return sourceEn;
    return undefined;
  }
  if (typeof obj === "string") {
    if (obj.trim() !== "") return obj;
    if (FALLBACK_FROM_EN && typeof sourceEn === "string") return sourceEn;
    return undefined;
  }
  // Primitives (number, boolean) → keep
  if (typeof obj !== "object") return obj;

  const sourceObj =
    sourceEn !== null &&
    typeof sourceEn === "object" &&
    !Array.isArray(sourceEn)
      ? sourceEn
      : {};

  if (Array.isArray(obj)) {
    const sourceArr = Array.isArray(sourceEn) ? sourceEn : null;
    const cleaned = obj
      .map((item, i) => {
        const sourceItem =
          sourceArr && i < sourceArr.length ? sourceArr[i] : undefined;
        return removeEmptyTranslations(item, sourceItem);
      })
      .filter((item) => item !== undefined);
    if (cleaned.length > 0) return cleaned;
    if (FALLBACK_FROM_EN && sourceArr && sourceArr.length > 0) return sourceArr;
    return undefined;
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const sourceVal = Object.prototype.hasOwnProperty.call(sourceObj, key)
      ? sourceObj[key]
      : undefined;
    const cleaned = removeEmptyTranslations(value, sourceVal);
    if (cleaned !== undefined) {
      result[key] = cleaned;
    } else if (FALLBACK_FROM_EN && sourceVal !== undefined) {
      result[key] = sourceVal;
    }
  }
  if (Object.keys(result).length > 0) return result;
  if (FALLBACK_FROM_EN && Object.keys(sourceObj).length > 0) return sourceObj;
  return undefined;
}

const localeDirs = [
  "ar",
  "de",
  "el",
  "es",
  "fi",
  "fr",
  "hi",
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
];

let totalRemoved = 0;
const enPath = join(LOCALES_DIR, "en", "common.json");
const sourceEn = FALLBACK_FROM_EN
  ? JSON.parse(readFileSync(enPath, "utf-8"))
  : null;

if (FALLBACK_FROM_EN) {
  console.log("Using en/common.json as fallback for null/empty values.\n");
} else {
  console.log(
    "Removing keys with no content (null, empty string, empty objects/arrays).\n",
  );
}

for (const locale of localeDirs) {
  const filePath = join(LOCALES_DIR, locale, "common.json");
  const content = readFileSync(filePath, "utf-8");
  const data = JSON.parse(content);

  const count = countEmpty(data);
  const cleaned = removeEmptyTranslations(data, sourceEn);

  if (cleaned === undefined) {
    console.log(`${locale}: file would be empty, skipping`);
    continue;
  }

  const beforeKeys = JSON.stringify(data).length;
  const afterKeys = JSON.stringify(cleaned).length;
  const removed = beforeKeys - afterKeys;

  if (count > 0 || removed > 0) {
    writeFileSync(filePath, JSON.stringify(cleaned, null, 2) + "\n", "utf-8");
    console.log(`${locale}: removed ${count} empty key(s)`);
    totalRemoved += count;
  } else {
    console.log(`${locale}: no empty keys found`);
  }
}

console.log(`\nDone. Total empty keys removed: ${totalRemoved}`);

#!/usr/bin/env node

/**
 * Translation Audit Script
 *
 * Compares all locale translation files against the English (source) file
 * and reports missing keys.
 *
 * Usage:
 *   node scripts/audit-translations.mjs [options]
 *
 * Options:
 *   --locale=XX    Audit only a specific locale (e.g., --locale=zh)
 *   --summary      Show only summary counts, not individual keys
 *   --json         Output results as JSON
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, "../public/locales");

const locales = [
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

/**
 * Recursively get all keys from a nested object
 * Returns keys in dot notation (e.g., "hero.title")
 */
function getAllKeys(obj, prefix = "") {
  const keys = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

/**
 * Check if a key exists in an object using dot notation
 */
function hasKey(obj, path) {
  const parts = path.split(".");
  let current = obj;

  for (const part of parts) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== "object"
    ) {
      return false;
    }
    if (!(part in current)) {
      return false;
    }
    current = current[part];
  }

  return true;
}

/**
 * Load and parse a JSON file
 */
function loadJson(filePath) {
  try {
    const content = readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Group missing keys by their top-level namespace
 */
function groupByNamespace(keys) {
  const groups = {};

  for (const key of keys) {
    const namespace = key.split(".")[0];
    if (!groups[namespace]) {
      groups[namespace] = [];
    }
    groups[namespace].push(key);
  }

  return groups;
}

function main() {
  const args = process.argv.slice(2);
  const localeArg = args.find((a) => a.startsWith("--locale="));
  const summaryOnly = args.includes("--summary");
  const jsonOutput = args.includes("--json");

  const targetLocales = localeArg ? [localeArg.split("=")[1]] : locales;

  // Load English (source) translations
  const enPath = join(LOCALES_DIR, "en", "common.json");
  const enTranslations = loadJson(enPath);

  if (!enTranslations) {
    console.error("Failed to load English translations");
    process.exit(1);
  }

  const enKeys = getAllKeys(enTranslations);
  console.log(`\n📊 Translation Audit Report`);
  console.log(`${"=".repeat(50)}`);
  console.log(`Source (en): ${enKeys.length} total keys\n`);

  const results = {};

  for (const locale of targetLocales) {
    const localePath = join(LOCALES_DIR, locale, "common.json");
    const localeTranslations = loadJson(localePath);

    if (!localeTranslations) {
      results[locale] = { error: "Failed to load" };
      continue;
    }

    const localeKeys = getAllKeys(localeTranslations);
    const missingKeys = enKeys.filter(
      (key) => !hasKey(localeTranslations, key),
    );
    const extraKeys = localeKeys.filter((key) => !hasKey(enTranslations, key));

    results[locale] = {
      total: localeKeys.length,
      missing: missingKeys,
      extra: extraKeys,
      missingCount: missingKeys.length,
      extraCount: extraKeys.length,
      coverage: (
        ((enKeys.length - missingKeys.length) / enKeys.length) *
        100
      ).toFixed(1),
    };
  }

  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  // Print results
  for (const locale of targetLocales) {
    const result = results[locale];

    if (result.error) {
      console.log(`\n❌ ${locale}: ${result.error}`);
      continue;
    }

    const statusIcon = result.missingCount === 0 ? "✅" : "⚠️";
    console.log(
      `\n${statusIcon} ${locale.toUpperCase()} - ${result.coverage}% coverage`,
    );
    console.log(
      `   Keys: ${result.total} | Missing: ${result.missingCount} | Extra: ${result.extraCount}`,
    );

    if (!summaryOnly && result.missingCount > 0) {
      const grouped = groupByNamespace(result.missing);
      const namespaces = Object.keys(grouped).sort();

      console.log(`\n   Missing keys by namespace:`);
      for (const ns of namespaces) {
        console.log(`\n   📁 ${ns} (${grouped[ns].length} missing)`);
        // Show first 5 keys per namespace to avoid overwhelming output
        const keysToShow = grouped[ns].slice(0, 5);
        for (const key of keysToShow) {
          console.log(`      - ${key}`);
        }
        if (grouped[ns].length > 5) {
          console.log(`      ... and ${grouped[ns].length - 5} more`);
        }
      }
    }
  }

  // Summary
  console.log(`\n${"=".repeat(50)}`);
  console.log(`\n📋 Summary:`);

  const localesWithMissing = Object.entries(results).filter(
    ([, r]) => r.missingCount > 0,
  );

  if (localesWithMissing.length === 0) {
    console.log("   All locales are fully translated! 🎉");
  } else {
    console.log(
      `   ${localesWithMissing.length} locale(s) have missing translations:\n`,
    );

    // Sort by missing count descending
    localesWithMissing.sort((a, b) => b[1].missingCount - a[1].missingCount);

    for (const [locale, result] of localesWithMissing) {
      console.log(
        `   ${locale}: ${result.missingCount} missing (${result.coverage}% coverage)`,
      );
    }

    // Find commonly missing keys (missing in multiple locales)
    const keyMissingCounts = {};
    for (const [, result] of localesWithMissing) {
      for (const key of result.missing) {
        keyMissingCounts[key] = (keyMissingCounts[key] || 0) + 1;
      }
    }

    const commonlyMissing = Object.entries(keyMissingCounts)
      .filter(([_, count]) => count >= Math.ceil(localesWithMissing.length / 2))
      .sort((a, b) => b[1] - a[1]);

    if (commonlyMissing.length > 0) {
      console.log(`\n   🔑 Keys missing in multiple locales:`);
      for (const [key, count] of commonlyMissing.slice(0, 10)) {
        console.log(`      ${key} (missing in ${count} locales)`);
      }
      if (commonlyMissing.length > 10) {
        console.log(
          `      ... and ${commonlyMissing.length - 10} more commonly missing keys`,
        );
      }
    }
  }

  console.log("");
}

main();

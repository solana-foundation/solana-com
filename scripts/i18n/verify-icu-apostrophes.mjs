#!/usr/bin/env node
/* global console */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

// intl-messageformat (next-intl) treats an ASCII apostrophe directly before
// an ICU tag as the start of quoted text, so "d'<colored>IA</colored>" drops
// the apostrophe and renders the tag literally, and an apostrophe before a
// closing tag fails with UNCLOSED_TAG. The typographic apostrophe is not an
// ICU quote character and reads correctly in every supported language.
export const asciiApostropheBeforeTag = /'(?=<\/?[a-zA-Z])/g;
export const typographicApostrophe = "’";

export function fixApostrophesBeforeTags(text) {
  return text.replace(asciiApostropheBeforeTag, typographicApostrophe);
}

export function findApostrophesBeforeTags(messages, prefix = "") {
  if (typeof messages === "string") {
    asciiApostropheBeforeTag.lastIndex = 0;
    return asciiApostropheBeforeTag.test(messages)
      ? [{ key: prefix, value: messages }]
      : [];
  }

  if (messages === null || typeof messages !== "object") {
    return [];
  }

  return Object.entries(messages).flatMap(([key, value]) =>
    findApostrophesBeforeTags(value, prefix ? `${prefix}.${key}` : key),
  );
}

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export function listCatalogs(rootDir) {
  return fs
    .globSync("packages/i18n/messages/*/*/*.json", { cwd: rootDir })
    .toSorted();
}

export function checkCatalogs(rootDir, { fix = false } = {}) {
  const lockPath = path.join(rootDir, ".lingo/lock.json");
  const lock = fs.existsSync(lockPath)
    ? JSON.parse(fs.readFileSync(lockPath, "utf8"))
    : null;
  const findings = [];
  let fixedFiles = 0;
  let refreshedLockEntries = 0;

  for (const catalogPath of listCatalogs(rootDir)) {
    const absolutePath = path.join(rootDir, catalogPath);
    const text = fs.readFileSync(absolutePath, "utf8");
    const hits = findApostrophesBeforeTags(JSON.parse(text));

    if (hits.length === 0) {
      continue;
    }

    if (!fix) {
      findings.push(...hits.map((hit) => ({ catalogPath, ...hit })));
      continue;
    }

    // Replace in the raw text so the catalog's formatting is untouched; an
    // apostrophe before "<" can only occur inside a string value.
    const fixed = fixApostrophesBeforeTags(text);
    fs.writeFileSync(absolutePath, fixed);
    fixedFiles++;

    // Follow the lock only when it described the bytes just rewritten, i.e.
    // fresh Lingo output. A catalog a human already edited stays diverged so
    // the Lingo CLI keeps treating it as locally edited.
    const lockEntry = lock?.files?.[catalogPath];
    if (lockEntry?.sha256 === sha256(text)) {
      lockEntry.sha256 = sha256(fixed);
      refreshedLockEntries++;
    }
  }

  if (refreshedLockEntries > 0) {
    fs.writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
  }

  return { findings, fixedFiles, refreshedLockEntries };
}

function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const rootDir = path.resolve(scriptDir, "../..");
  const fix = process.argv.includes("--fix");
  const { findings, fixedFiles, refreshedLockEntries } = checkCatalogs(
    rootDir,
    { fix },
  );

  if (fix) {
    console.log(
      fixedFiles === 0
        ? "No ICU apostrophes needed normalization"
        : `Normalized ASCII apostrophes before ICU tags in ${fixedFiles} catalog(s) (${refreshedLockEntries} lock entr${refreshedLockEntries === 1 ? "y" : "ies"} refreshed).`,
    );
    return;
  }

  if (findings.length > 0) {
    console.error(
      "ASCII apostrophe directly before an ICU tag; intl-messageformat reads it as a quote and renders the tag literally. Use ’ or run with --fix.",
    );
    for (const { catalogPath, key, value } of findings) {
      console.error(`- ${catalogPath} ${key}: ${value.slice(0, 100)}`);
    }
    process.exit(1);
  }

  console.log("ICU apostrophe guard passed");
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main();
}

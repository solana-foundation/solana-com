#!/usr/bin/env node
/* global console */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "../..");
const contentDir = path.join(rootDir, "apps/docs/content");
const config = JSON.parse(
  fs.readFileSync(path.join(rootDir, ".lingo/config.json"), "utf8"),
);
const lockPath = path.join(rootDir, ".lingo/lock.json");
const lock = fs.existsSync(lockPath)
  ? JSON.parse(fs.readFileSync(lockPath, "utf8"))
  : null;
const targetLocalePattern = new RegExp(
  `/content/(?:docs|learn|developers-learn)/(${config.targetLocales.join("|")})/`,
);

let changedFiles = 0;
let removedBackticks = 0;
let changedLockEntries = 0;

function isTranslatedDocsFile(filePath) {
  return targetLocalePattern.test(filePath.replaceAll(path.sep, "/"));
}

function sanitizeFile(filePath) {
  if (!isTranslatedDocsFile(filePath)) return;

  const source = fs.readFileSync(filePath, "utf8");
  const newline = source.includes("\r\n") ? "\r\n" : "\n";
  const lines = source.split(/\r?\n/);
  if (lines[0] !== "---") return;

  const closingDelimiter = lines.indexOf("---", 1);
  if (closingDelimiter === -1) return;

  let changed = false;

  for (let index = 1; index < closingDelimiter; index++) {
    if (!lines[index].includes("`")) continue;

    const count = lines[index].match(/`/g)?.length ?? 0;
    lines[index] = lines[index].replaceAll("`", "");
    removedBackticks += count;
    changed = true;
  }

  if (!changed) return;

  const sanitized = lines.join(newline);
  fs.writeFileSync(filePath, sanitized);
  changedFiles++;

  const relativePath = path
    .relative(rootDir, filePath)
    .replaceAll(path.sep, "/");
  const lockEntry = lock?.files?.[relativePath];
  if (!lockEntry) return;

  lockEntry.sha256 = crypto
    .createHash("sha256")
    .update(sanitized)
    .digest("hex");
  changedLockEntries++;
}

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      visit(filePath);
      continue;
    }

    if (entry.isFile() && path.extname(entry.name) === ".mdx") {
      sanitizeFile(filePath);
    }
  }
}

visit(contentDir);

if (changedLockEntries > 0) {
  fs.writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
}

if (changedFiles === 0) {
  console.log("No translated docs frontmatter needed normalization");
} else {
  console.log(
    `Normalized translated docs frontmatter in ${changedFiles} file(s) (${removedBackticks} backtick(s) removed, ${changedLockEntries} lock entr${changedLockEntries === 1 ? "y" : "ies"} refreshed).`,
  );
}

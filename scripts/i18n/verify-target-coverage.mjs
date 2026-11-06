/* global console */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
// --root points the guard at a fixture repository in tests.
const rootDir = path.resolve(
  readOption("--root") ?? path.resolve(scriptDir, "../.."),
);
const configPath = path.join(rootDir, ".lingo/config.json");
const lockPath = path.join(rootDir, ".lingo/lock.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const lock = fs.existsSync(lockPath)
  ? JSON.parse(fs.readFileSync(lockPath, "utf8"))
  : null;
const requestedScope = process.argv[2] ?? "all";
const missingOnly = process.argv.includes("--missing-only");
const staleSourcesOnly = process.argv.includes("--stale-json-sources");
const lockBaselinePath = readOption("--lock-baseline");
const lockBaseline = lockBaselinePath
  ? JSON.parse(fs.readFileSync(path.resolve(rootDir, lockBaselinePath), "utf8"))
  : null;

function readOption(flag) {
  const index = process.argv.indexOf(flag);
  return index === -1 ? null : (process.argv[index + 1] ?? null);
}

function isPatternInScope(pattern) {
  if (requestedScope === "all") {
    return true;
  }

  if (requestedScope === "docs") {
    return (
      pattern.startsWith("apps/docs/") ||
      pattern.startsWith("apps/web/content/learn/")
    );
  }

  if (requestedScope === "ui") {
    return pattern.startsWith("packages/i18n/messages/");
  }

  return pattern.startsWith(`packages/i18n/messages/${requestedScope}/`);
}

const scopedFileGroups = config.files.filter((fileGroup) =>
  (fileGroup.include ?? [fileGroup.pattern]).some(isPatternInScope),
);

if (scopedFileGroups.length === 0) {
  console.error(`No Lingo file groups match the "${requestedScope}" scope.`);
  process.exit(1);
}

const excludedSources = new Set(
  scopedFileGroups.flatMap((fileGroup) =>
    (fileGroup.exclude ?? []).flatMap((pattern) =>
      fs.globSync(pattern, { cwd: rootDir }),
    ),
  ),
);
const sourceFiles = [
  ...new Set(
    scopedFileGroups
      .flatMap((fileGroup) =>
        (fileGroup.include ?? [fileGroup.pattern]).flatMap((pattern) =>
          fs.globSync(pattern, { cwd: rootDir }),
        ),
      )
      .filter((filePath) => !excludedSources.has(filePath)),
  ),
];

function getTargetPath(sourcePath, targetLocale) {
  const directoryLocale = `/${config.sourceLocale}/`;
  const filenameLocale = `-${config.sourceLocale}.`;

  if (sourcePath.includes(directoryLocale)) {
    return sourcePath.replace(directoryLocale, `/${targetLocale}/`);
  }

  if (sourcePath.includes(filenameLocale)) {
    return sourcePath.replace(filenameLocale, `-${targetLocale}.`);
  }

  throw new Error(
    `Cannot map source locale to a target path for ${sourcePath}`,
  );
}

const missingTargets = sourceFiles.flatMap((sourcePath) =>
  config.targetLocales
    .map((targetLocale) => getTargetPath(sourcePath, targetLocale))
    .filter((targetPath) => !fs.existsSync(path.join(rootDir, targetPath))),
);
const targetCount = sourceFiles.length * config.targetLocales.length;

function reportMissingTargets() {
  for (const targetPath of missingTargets.slice(0, 20)) {
    console.error(`- missing file: ${targetPath}`);
  }

  if (missingTargets.length > 20) {
    console.error(`- …and ${missingTargets.length - 20} more missing files`);
  }
}

if (missingOnly) {
  if (missingTargets.length > 0) {
    console.error("Lingo target files are missing.");
    reportMissingTargets();
    process.exit(1);
  }

  console.log(
    `Lingo target file guard passed for the "${requestedScope}" scope (${targetCount} existing targets).`,
  );
  process.exit(0);
}

function getLeafKeys(value, prefix = "") {
  if (value === null || typeof value !== "object") {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    getLeafKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

const incompleteJsonTargets = [];
const staleLockedTargets = [];
const editedLockedTargets = [];

function sha256(filePath) {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex");
}

for (const sourcePath of sourceFiles.filter((filePath) =>
  filePath.endsWith(".json"),
)) {
  const source = JSON.parse(
    fs.readFileSync(path.join(rootDir, sourcePath), "utf8"),
  );
  const sourceKeys = getLeafKeys(source);

  for (const targetLocale of config.targetLocales) {
    const targetPath = getTargetPath(sourcePath, targetLocale);
    const absoluteTargetPath = path.join(rootDir, targetPath);

    if (!fs.existsSync(absoluteTargetPath)) {
      continue;
    }

    const target = JSON.parse(fs.readFileSync(absoluteTargetPath, "utf8"));
    const targetKeys = new Set(getLeafKeys(target));
    const missingKeys = sourceKeys.filter((key) => !targetKeys.has(key));

    if (missingKeys.length > 0) {
      incompleteJsonTargets.push({ sourcePath, targetPath, missingKeys });
    }
  }
}

// The Lingo server can report a JSON target as cached while the committed
// copy still lacks source keys. Print those sources so the runner can force
// a scoped retranslation of exactly those files.
if (staleSourcesOnly) {
  const staleSources = [
    ...new Set(incompleteJsonTargets.map(({ sourcePath }) => sourcePath)),
  ];
  console.log(JSON.stringify(staleSources));
  process.exit(0);
}

// .lingo/lock.json records the sha256 of every file Lingo last wrote. The
// Lingo CLI compares a target against that hash to tell its own output from a
// human edit: a target matching the lock may be overwritten by a pull, while a
// diverged target is reported as a conflict and left alone. Divergence is
// therefore the expected state after a PR edits translated files on main, and
// the next push merges those edits in and relocks them. Never refresh the lock
// to hide it; that would let Lingo overwrite the edits.
//
// Inside the Lingo workflow, run.mjs passes the pre-push lock as a baseline.
// A target that still diverges although its source changed since the baseline
// is Lingo output the run failed to deliver, so only that case fails.
if (lock) {
  for (const sourcePath of sourceFiles) {
    const sourceChanged = lockBaseline
      ? lockBaseline.files[sourcePath]?.sha256 !==
        sha256(path.join(rootDir, sourcePath))
      : false;

    for (const targetLocale of config.targetLocales) {
      const targetPath = getTargetPath(sourcePath, targetLocale);
      const absoluteTargetPath = path.join(rootDir, targetPath);
      const lockedHash = lock.files[targetPath]?.sha256;

      if (!lockedHash || !fs.existsSync(absoluteTargetPath)) {
        continue;
      }

      if (sha256(absoluteTargetPath) === lockedHash) {
        continue;
      }

      if (sourceChanged) {
        staleLockedTargets.push(targetPath);
      } else {
        editedLockedTargets.push(targetPath);
      }
    }
  }
}

function reportList(label, items, more) {
  for (const item of items.slice(0, 20)) {
    console.error(`- ${label}: ${item}`);
  }

  if (items.length > 20) {
    console.error(`- …and ${items.length - 20} more ${more}`);
  }
}

if (editedLockedTargets.length > 0) {
  console.warn(
    `${editedLockedTargets.length} target file(s) were edited since the Lingo lock was written; the next Lingo push merges and relocks them.`,
  );
  reportList("edited since Lingo lock", editedLockedTargets, "edited files");
}

if (
  missingTargets.length > 0 ||
  incompleteJsonTargets.length > 0 ||
  staleLockedTargets.length > 0
) {
  console.error("Lingo target coverage is incomplete.");
  reportMissingTargets();

  for (const { targetPath, missingKeys } of incompleteJsonTargets.slice(
    0,
    20,
  )) {
    console.error(
      `- incomplete JSON: ${targetPath} (${missingKeys.length} missing keys)`,
    );
  }

  if (incompleteJsonTargets.length > 20) {
    console.error(
      `- …and ${incompleteJsonTargets.length - 20} more incomplete JSON files`,
    );
  }

  reportList(
    "stale Lingo output (source changed, target not relocked)",
    staleLockedTargets,
    "stale targets",
  );

  process.exit(1);
}

console.log(
  `Lingo target coverage guard passed for the "${requestedScope}" scope (${sourceFiles.length} sources, ${targetCount} existing targets).`,
);

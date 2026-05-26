#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const messagesRoot = path.join(repoRoot, "packages/i18n/messages");

const appConfigs = {
  web: {
    codeRoots: [path.join(repoRoot, "apps/web/src")],
    inherits: [],
  },
  docs: {
    codeRoots: [path.join(repoRoot, "apps/docs/src")],
    inherits: ["web"],
  },
  media: {
    codeRoots: [
      path.join(repoRoot, "apps/media/app"),
      path.join(repoRoot, "apps/media/components"),
      path.join(repoRoot, "apps/media/lib"),
      path.join(repoRoot, "packages/ui-chrome/src"),
    ],
    inherits: ["web"],
  },
  accelerate: {
    codeRoots: [path.join(repoRoot, "apps/accelerate/src")],
    inherits: [],
  },
  breakpoint: {
    codeRoots: [path.join(repoRoot, "apps/breakpoint/src")],
    inherits: [],
  },
  templates: {
    codeRoots: [path.join(repoRoot, "apps/templates/src")],
    inherits: ["web"],
  },
};

const fileExtensions = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);

function walk(dir, files = []) {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) {
    return files;
  }

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    if (fileExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function flattenKeys(value, prefix = "", keys = new Set()) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    if (prefix) keys.add(prefix);
    return keys;
  }

  for (const [key, child] of Object.entries(value)) {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    flattenKeys(child, nextPrefix, keys);
  }

  return keys;
}

function topLevelSegments(keys) {
  return new Set([...keys].map((key) => key.split(".")[0]));
}

function extractLiteralMap(source) {
  const literals = new Map();
  const literalRegex =
    /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*["'`]([^"'`]+)["'`]/g;

  for (const match of source.matchAll(literalRegex)) {
    literals.set(match[1], match[2]);
  }

  return literals;
}

function collectUsedKeysFromFile(filePath) {
  const source = readFileSync(filePath, "utf8");
  const literals = extractLiteralMap(source);
  const usedKeys = new Set();
  const namespaces = new Map();

  const nsRegexes = [
    /useTranslations\(\s*["'`]([^"'`]+)["'`]\s*\)/g,
    /getTranslations\(\s*\{[^}]*namespace:\s*["'`]([^"'`]+)["'`][^}]*\}\s*\)/g,
    /useTranslations\(\s*([A-Za-z_$][\w$]*)\s*\)/g,
    /getTranslations\(\s*\{[^}]*namespace:\s*([A-Za-z_$][\w$]*)[^}]*\}\s*\)/g,
  ];

  for (const regex of nsRegexes) {
    for (const match of source.matchAll(regex)) {
      const resolved = literals.get(match[1]) ?? match[1];
      namespaces.set(match.index ?? 0, resolved);
    }
  }

  const sortedNamespaces = [...namespaces.entries()].sort(
    (a, b) => a[0] - b[0],
  );

  const keyRegex = /\bt\(\s*["'`]([^"'`]+)["'`]/g;
  for (const match of source.matchAll(keyRegex)) {
    const key = match[1];
    if (!key) continue;

    const nearestNamespace = [...sortedNamespaces]
      .reverse()
      .find(([index]) => index < (match.index ?? 0))?.[1];

    if (nearestNamespace && !key.includes(".")) {
      usedKeys.add(`${nearestNamespace}.${key}`);
      continue;
    }

    usedKeys.add(key);
  }

  return usedKeys;
}

function collectUsedKeys(app) {
  const usedKeys = new Set();

  for (const codeRoot of appConfigs[app].codeRoots) {
    for (const filePath of walk(codeRoot)) {
      for (const key of collectUsedKeysFromFile(filePath)) {
        usedKeys.add(key);
      }
    }
  }

  return usedKeys;
}

function loadAppKeys(app) {
  const enPath = path.join(messagesRoot, app, "en", "common.json");
  if (!exists(enPath)) {
    return new Set();
  }
  const json = JSON.parse(readFileSync(enPath, "utf8"));
  return flattenKeys(json);
}

function exists(filePath) {
  return statSync(filePath, { throwIfNoEntry: false })?.isFile() ?? false;
}

const report = {};

for (const app of Object.keys(appConfigs)) {
  const usedKeys = collectUsedKeys(app);
  const localKeys = loadAppKeys(app);
  const localTopLevels = topLevelSegments(localKeys);
  const usedTopLevels = topLevelSegments(usedKeys);
  const inheritedTopLevels = new Set();

  for (const inheritedApp of appConfigs[app].inherits) {
    for (const key of topLevelSegments(loadAppKeys(inheritedApp))) {
      inheritedTopLevels.add(key);
    }
  }

  const unusedTopLevels = [...localTopLevels].filter(
    (key) => !usedTopLevels.has(key),
  );
  const duplicatedInheritedTopLevels = [...localTopLevels].filter((key) =>
    inheritedTopLevels.has(key),
  );

  report[app] = {
    localTopLevels: [...localTopLevels].sort(),
    usedTopLevels: [...usedTopLevels].sort(),
    unusedTopLevels: unusedTopLevels.sort(),
    duplicatedInheritedTopLevels: duplicatedInheritedTopLevels.sort(),
  };
}

console.log(JSON.stringify(report, null, 2));

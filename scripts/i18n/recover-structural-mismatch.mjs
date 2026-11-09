import fs from "node:fs";
import path from "node:path";

const ansiColor = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");

// Lingo CLI 1.16 reports two kinds of MDX structure drift. Both leave the
// target untouched and both are reset by retranslating that one file.
const structureReasons = [
  String.raw` because the source and target document structures are not aligned \(unit .*\)\. Force a full retranslation of this file to reset it\.`,
  String.raw`, unit \S+: inline structures do not correspond unambiguously between the previous source and target\. Align the affected markup or explicitly retranslate this file\. Existing wording has not been changed\.`,
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Content roots come from the Lingo config so a new MDX collection is
// recoverable without touching this file.
export function mdxSourceRoots(config) {
  const localeSegment = `/${config.sourceLocale}/`;
  const roots = config.files
    .flatMap((fileGroup) => fileGroup.include ?? [fileGroup.pattern])
    .filter(
      (pattern) => pattern.endsWith(".mdx") && pattern.includes(localeSegment),
    )
    .map((pattern) => pattern.slice(0, pattern.indexOf(localeSegment)));

  return [...new Set(roots)];
}

export function failedStructuralTargets(output, config, rootDir) {
  // Lingo colors the final error on interactive and CI runners.
  const plainOutput = output
    .replace(ansiColor, "")
    .replace(/\^\[\[[0-9;]*m/g, "");
  const summary = plainOutput.match(
    /(?:^|\n)\s*(\d+) target\(s\) failed:\s*\n/,
  );
  const finalError = plainOutput.match(
    /Error: (\d+) target\(s\) failed during run /,
  );

  if (!summary || !finalError || summary[1] !== finalError[1]) {
    return [];
  }

  const roots = mdxSourceRoots(config);
  if (roots.length === 0) {
    return [];
  }

  const rootPattern = `(?:${roots.map(escapeRegExp).join("|")})`;
  const failureLine = new RegExp(
    `^\\s+(${rootPattern}/([a-z]{2})/[a-zA-Z0-9/_-]+\\.mdx): Failed to plan (${rootPattern}/${escapeRegExp(config.sourceLocale)}/[a-zA-Z0-9/_-]+\\.mdx): Cannot safely update \\S+ \\(mdx\\)(?:${structureReasons.join("|")})$`,
  );
  const failureLines = plainOutput
    .slice(summary.index + summary[0].length)
    .split("\n")
    .filter((line) => /^\s+\S+\.mdx: /.test(line));

  if (failureLines.length !== Number(summary[1])) {
    return [];
  }

  const targets = [];
  for (const line of failureLines) {
    const match = line.match(failureLine);
    if (!match) return [];

    const [, target, locale, source] = match;
    if (
      !config.targetLocales.includes(locale) ||
      target.replace(`/${locale}/`, `/${config.sourceLocale}/`) !== source ||
      !fs.existsSync(path.join(rootDir, target)) ||
      !fs.existsSync(path.join(rootDir, source))
    ) {
      return [];
    }
    targets.push(target);
  }

  return [...new Set(targets)];
}

export function removeFailedTargets(targets, rootDir) {
  for (const target of targets) {
    fs.unlinkSync(path.join(rootDir, target));
  }
}

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "../..");
const configPath = path.join(rootDir, ".lingo/config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

const excludedSources = new Set(
  config.files.flatMap((fileGroup) =>
    (fileGroup.exclude ?? []).flatMap((pattern) =>
      fs.globSync(pattern, { cwd: rootDir }),
    ),
  ),
);
const configuredSources = new Set(
  config.files
    .flatMap((fileGroup) =>
      (fileGroup.include ?? [fileGroup.pattern]).flatMap((pattern) =>
        fs.globSync(pattern, { cwd: rootDir }),
      ),
    )
    .filter((filePath) => !excludedSources.has(filePath)),
);

const sourcePatterns = [
  "packages/i18n/messages/*/en/*.json",
  "apps/docs/content/docs/en/**/*.mdx",
  "apps/docs/content/docs/en/**/meta.json",
  "apps/docs/content/learn/en/**/*.mdx",
  "apps/docs/content/learn/en/**/meta.json",
  "apps/docs/content/developers-learn/en/**/*.mdx",
  "apps/docs/content/developers-learn/en/**/meta.json",
];
const expectedSources = [
  ...new Set(
    sourcePatterns.flatMap((pattern) => fs.globSync(pattern, { cwd: rootDir })),
  ),
];
const uncoveredSources = expectedSources.filter(
  (filePath) =>
    !configuredSources.has(filePath) && !excludedSources.has(filePath),
);

if (uncoveredSources.length > 0) {
  console.error(
    "Locale-organized English sources are missing from .lingo/config.json:",
  );
  for (const filePath of uncoveredSources) {
    console.error(`- ${filePath}`);
  }
  process.exit(1);
}

console.log(
  `Lingo config coverage guard passed (${configuredSources.size} sources, ${excludedSources.size} intentional exclusions).`,
);

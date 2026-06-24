import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const configPaths = ["apps/docs/i18n.json", "packages/i18n/i18n.json"];

let hasError = false;

for (const configPath of configPaths) {
  const absolutePath = path.join(rootDir, configPath);
  const config = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  const sourceLocale = config.locale?.source;
  const targetLocales = config.locale?.targets;

  if (!sourceLocale || !Array.isArray(targetLocales)) {
    console.error(`${configPath}: missing locale.source or locale.targets`);
    hasError = true;
    continue;
  }

  if (targetLocales.includes(sourceLocale)) {
    console.error(
      `${configPath}: source locale "${sourceLocale}" must not be listed in locale.targets`,
    );
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}

console.log("i18n source locale guard passed");

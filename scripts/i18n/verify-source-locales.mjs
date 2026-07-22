import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "../..");
const configPath = ".lingo/config.json";
const absolutePath = path.join(rootDir, configPath);
const config = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
const sourceLocale = config.sourceLocale;
const targetLocales = config.targetLocales;

let hasError = false;

if (!sourceLocale || !Array.isArray(targetLocales)) {
  console.error(`${configPath}: missing sourceLocale or targetLocales`);
  hasError = true;
}

if (sourceLocale && Array.isArray(targetLocales)) {
  if (targetLocales.includes(sourceLocale)) {
    console.error(
      `${configPath}: source locale "${sourceLocale}" must not be listed in targetLocales`,
    );
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}

console.log("i18n source locale guard passed");

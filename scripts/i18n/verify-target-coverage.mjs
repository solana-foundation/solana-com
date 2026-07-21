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
const sourceFiles = [
  ...new Set(
    config.files
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

function getLeafKeys(value, prefix = "") {
  if (value === null || typeof value !== "object") {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    getLeafKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

const incompleteJsonTargets = [];

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
      incompleteJsonTargets.push({ targetPath, missingKeys });
    }
  }
}

if (missingTargets.length > 0 || incompleteJsonTargets.length > 0) {
  console.error(
    "Refusing to bootstrap Lingo because existing translations are incomplete.",
  );

  for (const targetPath of missingTargets.slice(0, 20)) {
    console.error(`- missing file: ${targetPath}`);
  }

  if (missingTargets.length > 20) {
    console.error(`- …and ${missingTargets.length - 20} more missing files`);
  }

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

  process.exit(1);
}

const targetCount = sourceFiles.length * config.targetLocales.length;
console.log(
  `Lingo target coverage guard passed (${sourceFiles.length} sources, ${targetCount} existing targets).`,
);

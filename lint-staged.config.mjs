import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));
const codeExtensions = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".mts",
  ".cts",
]);

function quote(file) {
  return JSON.stringify(file);
}

function getWorkspaceDir(file) {
  const normalized = file.split(path.sep);
  if (
    normalized.length >= 2 &&
    (normalized[0] === "apps" || normalized[0] === "packages")
  ) {
    return path.join(normalized[0], normalized[1]);
  }

  return ".";
}

function groupByWorkspace(files) {
  const groups = new Map();

  for (const file of files) {
    const workspaceDir = getWorkspaceDir(file);
    const workspaceFiles = groups.get(workspaceDir) ?? [];
    workspaceFiles.push(file);
    groups.set(workspaceDir, workspaceFiles);
  }

  return groups;
}

function buildEslintCommands(files) {
  const workspaceFiles = files.filter((file) =>
    codeExtensions.has(path.extname(file)),
  );
  const commands = [];

  for (const [workspaceDir, groupedFiles] of groupByWorkspace(workspaceFiles)) {
    const configPath = path.join(repoRoot, workspaceDir, "eslint.config.mjs");
    const relativeConfigPath = path.relative(repoRoot, configPath);

    commands.push(
      `pnpm -w exec eslint --fix --config ${quote(relativeConfigPath)} ${groupedFiles
        .map(quote)
        .join(" ")}`,
    );
  }

  return commands;
}

function buildPrettierCommand(files) {
  if (files.length === 0) {
    return [];
  }

  return [`pnpm -w exec prettier --write ${files.map(quote).join(" ")}`];
}

export default {
  "*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}": (files) => [
    ...buildEslintCommands(files),
    ...buildPrettierCommand(files),
  ],
  "*.{md,mdx,json,scss,yml,yaml}": buildPrettierCommand,
};

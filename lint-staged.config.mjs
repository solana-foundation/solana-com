import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));
const rootWorkspace = ".";
const eslintConfigFile = "eslint.config.mjs";
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

function getWorkspacePath(workspaceDir) {
  return path.join(repoRoot, workspaceDir);
}

function hasWorkspaceEslintConfig(workspaceDir) {
  if (workspaceDir === rootWorkspace) {
    return false;
  }

  return existsSync(
    path.join(getWorkspacePath(workspaceDir), eslintConfigFile),
  );
}

function toWorkspaceRelativeFile(workspaceDir, file) {
  return path.relative(
    getWorkspacePath(workspaceDir),
    path.join(repoRoot, file),
  );
}

function getEslintCommandInput(workspaceDir, files) {
  if (!hasWorkspaceEslintConfig(workspaceDir)) {
    return {
      cwd: rootWorkspace,
      config: path.relative(
        repoRoot,
        path.join(getWorkspacePath(workspaceDir), eslintConfigFile),
      ),
      files,
    };
  }

  return {
    cwd: workspaceDir,
    config: eslintConfigFile,
    files: files.map((file) => toWorkspaceRelativeFile(workspaceDir, file)),
  };
}

function buildEslintCommands(files) {
  const workspaceFiles = files.filter((file) =>
    codeExtensions.has(path.extname(file)),
  );
  const commands = [];

  for (const [workspaceDir, groupedFiles] of groupByWorkspace(workspaceFiles)) {
    const {
      cwd,
      config,
      files: eslintFiles,
    } = getEslintCommandInput(workspaceDir, groupedFiles);

    commands.push(
      `pnpm --dir ${quote(cwd)} exec eslint --fix --config ${quote(config)} ${eslintFiles
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

function buildMediaImageCheckCommand(files) {
  if (files.length === 0) {
    return [];
  }

  return [
    `pnpm --filter solana-com-media exec node scripts/check-images.mjs ${files
      .map(quote)
      .join(" ")}`,
  ];
}

export default {
  "*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}": (files) => [
    ...buildEslintCommands(files),
    ...buildPrettierCommand(files),
  ],
  "*.{md,mdx,json,scss,yml,yaml}": buildPrettierCommand,
  "apps/media/content/**/*.{png,jpg,jpeg,webp,avif}":
    buildMediaImageCheckCommand,
  "apps/media/public/uploads/posts/**/*.{png,jpg,jpeg,webp,avif}":
    buildMediaImageCheckCommand,
};

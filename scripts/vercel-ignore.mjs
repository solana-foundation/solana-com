#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const BUILD = 1;
const SKIP = 0;
const workspace = process.argv[2];

function log(message) {
  console.log(`[vercel-ignore] ${message}`);
}

function findRepositoryRoot(start) {
  let directory = resolve(start);

  while (true) {
    if (
      existsSync(resolve(directory, "package.json")) &&
      existsSync(resolve(directory, "turbo.json"))
    ) {
      return directory;
    }

    const parent = dirname(directory);

    if (parent === directory) return undefined;
    directory = parent;
  }
}

const repositoryRoot = findRepositoryRoot(process.cwd());

if (!repositoryRoot) {
  log("The repository root could not be found; proceeding with the build.");
  process.exit(BUILD);
}

function refExists(ref) {
  const result = spawnSync("git", ["cat-file", "-e", `${ref}^{commit}`], {
    cwd: repositoryRoot,
    stdio: "ignore",
  });

  return result.status === 0;
}

function getTurboVersion() {
  const packageJson = JSON.parse(
    readFileSync(resolve(repositoryRoot, "package.json"), "utf8"),
  );

  return packageJson.devDependencies?.turbo;
}

function getCurrentWorkspace() {
  try {
    const packageJson = JSON.parse(
      readFileSync(resolve(process.cwd(), "package.json"), "utf8"),
    );

    return packageJson.name;
  } catch {
    return undefined;
  }
}

if (!workspace || getCurrentWorkspace() !== workspace) {
  log(
    "The configured workspace does not match this project; proceeding with the build.",
  );
  process.exit(BUILD);
}

if (process.env.TURBO_FORCE === "true") {
  log("TURBO_FORCE is set; proceeding with the build.");
  process.exit(BUILD);
}

const base = process.env.TURBO_SCM_BASE ?? process.env.VERCEL_GIT_PREVIOUS_SHA;
const head =
  process.env.TURBO_SCM_HEAD ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "HEAD";

if (!base) {
  log("No previous commit is available; proceeding with the build.");
  process.exit(BUILD);
}

if (!refExists(base) || !refExists(head)) {
  log(`Cannot compare ${base} with ${head}; proceeding with the build.`);
  process.exit(BUILD);
}

const turboVersion = getTurboVersion();

if (!turboVersion) {
  log("The repository has no pinned Turbo version; proceeding with the build.");
  process.exit(BUILD);
}

log(`Checking ${workspace}#build between ${base} and ${head}.`);

const result = spawnSync(
  "npx",
  [
    "--yes",
    `turbo@${turboVersion}`,
    "query",
    "affected",
    "--tasks",
    "build",
    "--packages",
    workspace,
    "--base",
    base,
    "--head",
    head,
    "--exit-code",
    "--no-update-notifier",
    "--no-color",
  ],
  {
    cwd: repositoryRoot,
    env: process.env,
    stdio: "inherit",
  },
);

if (result.status === SKIP) {
  log(`${workspace}#build is unchanged; skipping the deployment.`);
  process.exit(SKIP);
}

if (result.status === BUILD) {
  log(`${workspace}#build is affected; proceeding with the build.`);
  process.exit(BUILD);
}

log("The affected check failed; proceeding with the build.");
process.exit(BUILD);

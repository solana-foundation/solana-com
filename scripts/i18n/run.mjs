import { spawnSync } from "node:child_process";
import fs from "node:fs";
import process from "node:process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "../..");
const lingoCliPackage = "@lingo.dev/cli@1.12.0";
const appTargets = new Set([
  "accelerate",
  "breakpoint",
  "docs",
  "media",
  "templates",
  "web",
]);
function loadEnvFileIfPresent(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  process.loadEnvFile(filePath);
}

function loadI18nEnv() {
  loadEnvFileIfPresent(path.join(rootDir, ".env.local"));
  loadEnvFileIfPresent(path.join(rootDir, ".env"));

  // Lingo now prefers LINGO_API_KEY, but keep the older repo convention working.
  if (!process.env.LINGO_API_KEY && process.env.LINGODOTDEV_API_KEY) {
    process.env.LINGO_API_KEY = process.env.LINGODOTDEV_API_KEY;
  }
}

loadI18nEnv();

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });

  return result.status ?? 1;
}

function runOrExit(command, args, cwd) {
  const status = run(command, args, cwd);

  if (status !== 0) {
    process.exit(status);
  }
}

function runLingo(args) {
  return run("npx", ["--yes", lingoCliPackage, ...args], rootDir);
}

function runLingoPush(args) {
  const pushStatus = runLingo(["push", ...args, "--wait"]);

  if (pushStatus === 0) {
    return;
  }

  console.error(
    "Lingo push ended before its outputs were downloaded; recovering and attaching to the same run.",
  );
  const resumeStatus = runLingo(["resume"]);

  if (resumeStatus !== 0) {
    console.error(
      "Lingo resume was not available; attempting to pull the same run anyway.",
    );
  }

  const pullStatus = runLingo(["pull"]);

  if (pullStatus !== 0) {
    process.exit(pushStatus);
  }
}

function verifyTargetCoverage() {
  return run("node", ["./scripts/i18n/verify-target-coverage.mjs"], rootDir);
}

function runContinuousLocalization(requestedScope) {
  const lockPath = path.join(rootDir, ".lingo/lock.json");

  if (!fs.existsSync(lockPath)) {
    console.log(
      "No .lingo/lock.json found; adopting existing translations without overwriting them.",
    );
    runOrExit("node", ["./scripts/i18n/verify-target-coverage.mjs"], rootDir);
    runLingoPush([]);

    if (requestedScope === "all" || requestedScope === "docs") {
      runOrExit(
        "node",
        ["./scripts/i18n/verify-docs-frontmatter.mjs"],
        rootDir,
      );
    }

    return;
  }

  // Current Lingo releases treat positional patterns as force/new-file scopes
  // and skip changed keys when target files already exist. Incremental pushes
  // must be config-wide; the lockfile still limits work to changed sources.
  if (requestedScope !== "all") {
    console.log(
      `Lingo incremental syncs are config-wide; processing changed sources for the requested "${requestedScope}" workflow.`,
    );
  }

  runLingoPush([]);

  if (requestedScope === "all" && verifyTargetCoverage() !== 0) {
    console.error(
      "Lingo left target coverage incomplete; retrying once with the updated lockfile.",
    );
    runLingoPush([]);
    runOrExit("node", ["./scripts/i18n/verify-target-coverage.mjs"], rootDir);
  }

  if (requestedScope === "all" || requestedScope === "docs") {
    runOrExit("node", ["./scripts/i18n/verify-docs-frontmatter.mjs"], rootDir);
  }
}

const [, , target, app] = process.argv;

runOrExit("node", ["./scripts/i18n/verify-source-locales.mjs"], rootDir);
runOrExit("node", ["./scripts/i18n/verify-config-coverage.mjs"], rootDir);

switch (target) {
  case "all":
  case "ui":
  case "docs":
    runContinuousLocalization(target);
    break;
  case "app":
    if (!app) {
      console.error("Usage: pnpm i18n:app <app>");
      process.exit(1);
    }

    if (!appTargets.has(app)) {
      console.error(`Unknown localization app: ${app}`);
      process.exit(1);
    }

    runContinuousLocalization(app);
    break;
  default:
    console.error("Usage: pnpm i18n[:ui|:docs|:app <app>]");
    process.exit(1);
}

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import process from "node:process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "../..");
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

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runContinuousLocalization(requestedScope) {
  const lockPath = path.join(rootDir, ".lingo/lock.json");

  if (!fs.existsSync(lockPath)) {
    console.log(
      "No .lingo/lock.json found; adopting existing translations without overwriting them.",
    );
    run("node", ["./scripts/i18n/verify-target-coverage.mjs"], rootDir);
    run("npx", ["--yes", "@lingo.dev/cli@latest", "push", "--wait"], rootDir);

    if (requestedScope === "all" || requestedScope === "docs") {
      run("node", ["./scripts/i18n/verify-docs-frontmatter.mjs"], rootDir);
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

  const args = ["--yes", "@lingo.dev/cli@latest", "push", "--wait"];

  run("npx", args, rootDir);

  if (requestedScope === "all" || requestedScope === "docs") {
    run("node", ["./scripts/i18n/verify-docs-frontmatter.mjs"], rootDir);
  }
}

const [, , target, app] = process.argv;

run("node", ["./scripts/i18n/verify-source-locales.mjs"], rootDir);

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

    if (app === "breakpoint") {
      console.log("Breakpoint has no local translation catalog to sync.");
      break;
    }

    runContinuousLocalization(app);
    break;
  default:
    console.error("Usage: pnpm i18n[:ui|:docs|:app <app>]");
    process.exit(1);
}

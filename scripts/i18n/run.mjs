/* global console */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "../..");
const config = JSON.parse(
  fs.readFileSync(path.join(rootDir, ".lingo/config.json"), "utf8"),
);
const cliVersion = process.env.LINGO_CLI_VERSION ?? "1.16.0";
const cliBin = process.env.LINGO_CLI_BIN;
const appScopes = new Set([
  "accelerate",
  "breakpoint",
  "docs",
  "media",
  "templates",
  "web",
]);

function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    process.loadEnvFile(filePath);
  }
}

function loadEnvironment() {
  loadEnvFile(path.join(rootDir, ".env.local"));
  loadEnvFile(path.join(rootDir, ".env"));

  if (!process.env.LINGO_API_KEY && process.env.LINGODOTDEV_API_KEY) {
    process.env.LINGO_API_KEY = process.env.LINGODOTDEV_API_KEY;
  }
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    console.error(result.error);
  }

  return result.status ?? 1;
}

function runOrExit(command, args) {
  const status = run(command, args);

  if (status !== 0) {
    process.exit(status);
  }
}

function runLingo(args) {
  if (cliBin) {
    runOrExit(cliBin, args);
    return;
  }

  runOrExit("npx", ["--yes", `@lingo.dev/cli@${cliVersion}`, ...args]);
}

function isPatternInScope(pattern, scope) {
  if (scope === "docs") {
    return pattern.startsWith("apps/docs/");
  }

  if (scope === "ui") {
    return pattern.startsWith("packages/i18n/messages/");
  }

  return pattern.startsWith(`packages/i18n/messages/${scope}/`);
}

function getScopePatterns(scope) {
  if (scope === "all") {
    return [];
  }

  const patterns = config.files
    .flatMap((fileGroup) => fileGroup.include ?? [fileGroup.pattern])
    .filter((pattern) => isPatternInScope(pattern, scope));

  if (patterns.length === 0) {
    console.error(`No Lingo file patterns match the "${scope}" scope.`);
    process.exit(1);
  }

  return patterns;
}

function parseScope() {
  const [, , target, app] = process.argv;

  if (["all", "ui", "docs"].includes(target)) {
    return target;
  }

  if (target === "app" && app && appScopes.has(app)) {
    return app;
  }

  if (target === "app" && app && !appScopes.has(app)) {
    console.error(`Unknown localization app: ${app}`);
  } else if (target === "app") {
    console.error("Usage: pnpm i18n:app <app>");
  } else {
    console.error("Usage: pnpm i18n[:ui|:docs|:app <app>]");
  }

  process.exit(1);
}

function verifyTargetCoverage(scope, missingOnly = false) {
  return run("node", [
    "./scripts/i18n/verify-target-coverage.mjs",
    scope,
    ...(missingOnly ? ["--missing-only"] : []),
  ]);
}

function main() {
  loadEnvironment();
  const scope = parseScope();
  const patterns = getScopePatterns(scope);

  runOrExit("node", ["./scripts/i18n/verify-source-locales.mjs"]);
  runOrExit("node", ["./scripts/i18n/verify-config-coverage.mjs"]);

  if (!process.env.LINGO_API_KEY) {
    console.error(
      "LINGO_API_KEY (or the legacy LINGODOTDEV_API_KEY) is required.",
    );
    process.exit(1);
  }

  // A failed push fails the job. GitHub discards the partial checkout, and a
  // rerun starts from the last committed lockfile instead of mutating targets
  // through automatic --force or pull recovery. The GitHub workflow applies
  // one cumulative deadline to this runner, including its validation steps.
  runLingo(["push", ...patterns, "--wait"]);

  // Backfill is config-wide. Scoped pushes rely on their final coverage guard
  // and fail rather than crossing the requested boundary.
  if (scope === "all" && verifyTargetCoverage("all", true) !== 0) {
    console.log("Backfilling missing target files across the full config.");
    runLingo(["push", "--backfill-missing", "--wait"]);
  }

  runOrExit("node", ["./scripts/i18n/verify-target-coverage.mjs", scope]);

  if (scope === "all" || scope === "docs") {
    runOrExit("node", ["./scripts/i18n/sanitize-docs-frontmatter.mjs"]);
    runOrExit("node", ["./scripts/i18n/verify-docs-frontmatter.mjs"]);
  }
}

main();

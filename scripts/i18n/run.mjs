/* global console */

import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  failedStructuralTargets,
  removeFailedTargets,
} from "./recover-structural-mismatch.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "../..");
const config = JSON.parse(
  fs.readFileSync(path.join(rootDir, ".lingo/config.json"), "utf8"),
);
const cliVersion = process.env.LINGO_CLI_VERSION ?? "1.16.0";
const cliBin = process.env.LINGO_CLI_BIN;
// Forced pushes overwrite every target of a source, so keep recovery narrow.
const maxForcedSources = 20;
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

function runLingoWithOutput(args) {
  const command = cliBin ?? "npx";
  const commandArgs = cliBin
    ? args
    : ["--yes", `@lingo.dev/cli@${cliVersion}`, ...args];

  return new Promise((resolve) => {
    const child = spawn(command, commandArgs, {
      cwd: rootDir,
      stdio: ["inherit", "pipe", "pipe"],
      shell: false,
    });
    let output = "";
    const append = (chunk, stream) => {
      const text = chunk.toString();
      stream.write(text);
      output = (output + text).slice(-128_000);
    };

    child.stdout.on("data", (chunk) => append(chunk, process.stdout));
    child.stderr.on("data", (chunk) => append(chunk, process.stderr));
    child.on("error", (error) => console.error(error));
    child.on("close", (status) => resolve({ status: status ?? 1, output }));
  });
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

function staleJsonSources(scope) {
  const result = spawnSync(
    "node",
    [
      "./scripts/i18n/verify-target-coverage.mjs",
      scope,
      "--stale-json-sources",
    ],
    { cwd: rootDir, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  return JSON.parse(result.stdout);
}

async function main() {
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

  // A partial Lingo run can leave only a few MDX targets with incompatible
  // structure. Backfill those exact files, preserving other translations and
  // the lockfile. Lingo detects missing targets from the filesystem.
  // Other failures still fail the job; GitHub discards the partial checkout.
  const push = await runLingoWithOutput(["push", ...patterns, "--wait"]);
  if (push.status !== 0) {
    const targets =
      scope === "all"
        ? failedStructuralTargets(push.output, config, rootDir)
        : [];
    if (targets.length === 0) process.exit(push.status);

    console.log(
      `Backfilling ${targets.length} structurally divergent MDX target(s).`,
    );
    removeFailedTargets(targets, rootDir);
    runLingo(["push", "--backfill-missing", "--wait"]);
  }

  // Backfill is config-wide. Scoped pushes rely on their final coverage guard
  // and fail rather than crossing the requested boundary.
  if (scope === "all" && verifyTargetCoverage("all", true) !== 0) {
    console.log("Backfilling missing target files across the full config.");
    runLingo(["push", "--backfill-missing", "--wait"]);
  }

  // The server skips targets whose source hash it has already translated,
  // even when the committed target never received that output. Force only
  // those sources so the cache cannot keep returning stale JSON.
  const staleSources = staleJsonSources(scope);
  if (staleSources.length > maxForcedSources) {
    console.error(
      `Refusing to force-retranslate ${staleSources.length} sources (limit ${maxForcedSources}); run a scoped push manually.`,
    );
    process.exit(1);
  }
  if (staleSources.length > 0) {
    console.log(
      `Force-retranslating ${staleSources.length} source(s) with incomplete JSON targets.`,
    );
    runLingo(["push", ...staleSources, "--force", "--yes", "--wait"]);
  }

  runOrExit("node", ["./scripts/i18n/verify-target-coverage.mjs", scope]);

  if (scope === "all" || scope === "docs") {
    runOrExit("node", ["./scripts/i18n/sanitize-docs-frontmatter.mjs"]);
    runOrExit("node", ["./scripts/i18n/verify-docs-frontmatter.mjs"]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

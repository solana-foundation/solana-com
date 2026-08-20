/* global clearTimeout, console, setTimeout */

import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import process from "node:process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "../..");
const lingoCliPackage = "@lingo.dev/cli@1.12.0";
const lingoTimeoutBufferMs = 30_000;
const lingoConfig = JSON.parse(
  fs.readFileSync(path.join(rootDir, ".lingo/config.json"), "utf8"),
);
const sourceLocale = lingoConfig.sourceLocale;
const targetLocales = new Set(lingoConfig.targetLocales);
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
  return new Promise((resolve) => {
    const commandArgs = ["--yes", lingoCliPackage, ...args];
    const shouldWait = args.includes("--wait");
    const configuredTimeoutMinutes = Number.parseInt(
      process.env.LINGO_WAIT_TIMEOUT_MINUTES ?? "210",
      10,
    );
    const configuredTimeout =
      Number.isFinite(configuredTimeoutMinutes) && configuredTimeoutMinutes > 0
        ? configuredTimeoutMinutes
        : 210;
    // A forced or backfill push is a bounded repair pass after the main run.
    const isRecoveryPush =
      args.includes("--force") || args.includes("--backfill-missing");
    const maxTimeoutMinutes = isRecoveryPush
      ? Math.min(configuredTimeout, 90)
      : configuredTimeout;
    const maxTimeoutMs = maxTimeoutMinutes * 60 * 1000;
    const jobDeadlineMs = Number.parseInt(
      process.env.LINGO_JOB_DEADLINE_MS ?? "",
      10,
    );
    const remainingJobMs = Number.isFinite(jobDeadlineMs)
      ? jobDeadlineMs - Date.now() - lingoTimeoutBufferMs
      : undefined;
    const timeoutMs = shouldWait
      ? Math.min(maxTimeoutMs, remainingJobMs ?? maxTimeoutMs)
      : undefined;

    if (shouldWait && timeoutMs <= 0) {
      console.error(
        "Not enough workflow time remains to start another bounded Lingo command; stopping it.",
      );
      resolve({
        status: 124,
        signal: undefined,
        error: undefined,
        output: "",
        timedOut: true,
      });
      return;
    }

    const timeoutMinutes = timeoutMs ? timeoutMs / 60 / 1000 : undefined;
    let output = "";
    let timedOut = false;
    let settled = false;
    let timeoutHandle;
    let killHandle;

    const finish = (status, signal, error) => {
      if (settled) return;
      settled = true;

      if (timeoutHandle) clearTimeout(timeoutHandle);
      if (killHandle) clearTimeout(killHandle);

      resolve({
        status: status ?? (timedOut ? 124 : 1),
        signal,
        error,
        output,
        timedOut,
      });
    };

    let child;
    try {
      child = spawn("npx", commandArgs, {
        cwd: rootDir,
        shell: false,
        stdio: ["inherit", "pipe", "pipe"],
      });
    } catch (error) {
      finish(1, undefined, error);
      return;
    }

    const forward = (stream) => (chunk) => {
      const text = chunk.toString();
      output += text;
      stream.write(text);
    };

    child.stdout.on("data", forward(process.stdout));
    child.stderr.on("data", forward(process.stderr));
    child.once("error", (error) => finish(1, undefined, error));
    child.once("close", (status, signal) => finish(status, signal));

    if (timeoutMs) {
      timeoutHandle = setTimeout(() => {
        timedOut = true;
        console.error(
          `Lingo command exceeded the ${timeoutMinutes}-minute wait limit; stopping it.`,
        );
        child.kill("SIGTERM");
        killHandle = setTimeout(() => child.kill("SIGKILL"), 10_000);
        killHandle.unref();
      }, timeoutMs);
      timeoutHandle.unref();
    }
  });
}

function sourcePathFromTarget(targetPath) {
  if (targetPath.includes(`/${sourceLocale}/`)) {
    return targetPath;
  }

  for (const locale of targetLocales) {
    const marker = `/${locale}/`;
    const localeIndex = targetPath.indexOf(marker);
    if (localeIndex === -1) continue;

    return `${targetPath.slice(0, localeIndex)}/${sourceLocale}/${targetPath.slice(
      localeIndex + marker.length,
    )}`;
  }

  return null;
}

function extractFailedSourcePatterns(output) {
  // Lingo uses ANSI color codes in the failure report.
  // eslint-disable-next-line no-control-regex
  const normalizedOutput = output.replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, "");
  const failedSourcePatterns = new Set();
  let collectingFailures = false;

  for (const line of normalizedOutput.split(/\r?\n/)) {
    if (line.includes("target(s) failed:")) {
      collectingFailures = true;
      continue;
    }

    if (!collectingFailures) continue;
    if (/^\s*Error:/.test(line)) break;

    for (const match of line.matchAll(
      /(?:apps\/docs\/content|packages\/i18n\/messages)\/[^\s:]+/g,
    )) {
      const sourcePath = sourcePathFromTarget(match[0]);
      if (sourcePath) failedSourcePatterns.add(sourcePath);
    }
  }

  return [...failedSourcePatterns];
}

async function recoverLingoRun() {
  const resumeResult = await runLingo(["resume"]);

  if (resumeResult.status !== 0) {
    console.error(
      "Lingo resume was not available; attempting to pull the same run anyway.",
    );
  }

  return runLingo(["pull"]);
}

async function recoverFailedPush(failedResult) {
  const recoveryResult = await recoverLingoRun();
  return recoveryResult.status === 0 ? recoveryResult : failedResult;
}

async function runLingoPush(args = []) {
  const pushResult = await runLingo(["push", ...args, "--wait"]);

  if (pushResult.status === 0) {
    return pushResult;
  }

  // A run can finish with per-target MDX/JSON failures while still producing
  // usable output for the other targets. Retry only the sources named by the
  // CLI, instead of silently accepting an incomplete localization run.
  const failedSourcePatterns = extractFailedSourcePatterns(pushResult.output);
  if (failedSourcePatterns.length > 0) {
    console.error(
      `Retrying ${failedSourcePatterns.length} failed Lingo source file(s) with --force.`,
    );

    const forceResult = await runLingo([
      "push",
      ...failedSourcePatterns,
      "--force",
      "--yes",
      "--wait",
    ]);

    if (forceResult.status === 0) {
      return forceResult;
    }

    console.error(
      "The targeted Lingo retry failed; recovering any completed outputs before exiting.",
    );
    return recoverFailedPush(forceResult);
  }

  console.error(
    "Lingo push failed without recoverable target paths; recovering any completed outputs before exiting.",
  );
  return recoverFailedPush(pushResult);
}

function verifyTargetCoverage() {
  return run("node", ["./scripts/i18n/verify-target-coverage.mjs"], rootDir);
}

function verifyDocsOutput() {
  runOrExit("node", ["./scripts/i18n/sanitize-docs-frontmatter.mjs"], rootDir);
  runOrExit("node", ["./scripts/i18n/verify-docs-frontmatter.mjs"], rootDir);
}

async function runContinuousLocalization(requestedScope) {
  const lockPath = path.join(rootDir, ".lingo/lock.json");
  let pushArgs = [];

  if (!fs.existsSync(lockPath)) {
    console.log(
      "No .lingo/lock.json found; adopting existing translations without overwriting them.",
    );
    if (verifyTargetCoverage() !== 0) {
      console.log(
        "Existing translations are missing targets; using Lingo backfill mode.",
      );
      pushArgs = ["--backfill-missing"];
    }
  }

  // Current Lingo releases treat positional patterns as force/new-file scopes
  // and skip changed keys when target files already exist. Incremental pushes
  // must be config-wide; the lockfile still limits work to changed sources.
  if (requestedScope !== "all") {
    console.log(
      `Lingo incremental syncs are config-wide; processing changed sources for the requested "${requestedScope}" workflow.`,
    );
  }

  const pushResult = await runLingoPush(pushArgs);
  if (pushResult.status !== 0) {
    process.exit(pushResult.status);
  }

  if (requestedScope === "all" && verifyTargetCoverage() !== 0) {
    console.error(
      "Lingo left target coverage incomplete; retrying once in backfill mode.",
    );
    const retryResult = await runLingoPush(["--backfill-missing"]);
    if (retryResult.status !== 0) {
      process.exit(retryResult.status);
    }
    runOrExit("node", ["./scripts/i18n/verify-target-coverage.mjs"], rootDir);
  }

  if (requestedScope === "all" || requestedScope === "docs") {
    verifyDocsOutput();
  }
}

async function main() {
  const [, , target, app] = process.argv;

  runOrExit("node", ["./scripts/i18n/verify-source-locales.mjs"], rootDir);
  runOrExit("node", ["./scripts/i18n/verify-config-coverage.mjs"], rootDir);

  switch (target) {
    case "all":
    case "ui":
    case "docs":
      await runContinuousLocalization(target);
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

      await runContinuousLocalization(app);
      break;
    default:
      console.error("Usage: pnpm i18n[:ui|:docs|:app <app>]");
      process.exit(1);
  }
}

await main();

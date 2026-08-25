/* global clearTimeout, console, setTimeout */

import { spawn, spawnSync } from "node:child_process";
import crypto from "node:crypto";
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

// Kept below the workflow's timeout-minutes so every Lingo command, retry,
// and recovery finishes before the job is killed. Only applied in CI; local
// runs are only capped by the per-command wait limit.
const jobTimeoutMinutes = 300;
const jobDeadlineMs = process.env.CI
  ? Date.now() + jobTimeoutMinutes * 60_000
  : undefined;

// Every command must finish before the workflow deadline; commands that wait
// on Lingo are additionally capped by the wait limit, and repair pushes get
// a shorter window so recovery still fits inside the deadline.
const waitTimeoutMinutes = 210;

function computeLingoTimeoutMs(args) {
  // `resume` re-attaches to an in-flight run and blocks like `push --wait`.
  const waitsOnLingo = args.includes("--wait") || args[0] === "resume";
  const isRecoveryPush =
    args.includes("--force") || args.includes("--backfill-missing");
  const maxTimeoutMs =
    (isRecoveryPush ? Math.min(waitTimeoutMinutes, 90) : waitTimeoutMinutes) *
    60_000;
  const remainingJobMs =
    jobDeadlineMs === undefined
      ? undefined
      : jobDeadlineMs - Date.now() - lingoTimeoutBufferMs;

  return waitsOnLingo
    ? Math.min(maxTimeoutMs, remainingJobMs ?? maxTimeoutMs)
    : remainingJobMs;
}

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
    const timeoutMs = computeLingoTimeoutMs(args);

    if (timeoutMs !== undefined && timeoutMs <= 0) {
      console.error(
        "Not enough workflow time remains to start another bounded Lingo command; stopping it.",
      );
      resolve({ status: 124, output: "" });
      return;
    }

    const timeoutMinutes = timeoutMs
      ? Math.round(timeoutMs / 6_000) / 10
      : undefined;
    let output = "";
    let timedOut = false;
    let settled = false;
    let timeoutHandle;
    let killHandle;

    const finish = (status, error) => {
      if (settled) return;
      settled = true;

      if (timeoutHandle) clearTimeout(timeoutHandle);
      if (killHandle) clearTimeout(killHandle);
      if (error) console.error(error);

      resolve({ status: status ?? (timedOut ? 124 : 1), output });
    };

    let child;
    try {
      child = spawn("npx", ["--yes", lingoCliPackage, ...args], {
        cwd: rootDir,
        shell: false,
        stdio: ["inherit", "pipe", "pipe"],
      });
    } catch (error) {
      finish(1, error);
      return;
    }

    const forward = (stream) => (chunk) => {
      const text = chunk.toString();
      output += text;
      stream.write(text);
    };

    child.stdout.on("data", forward(process.stdout));
    child.stderr.on("data", forward(process.stderr));
    child.once("error", (error) => finish(1, error));
    child.once("close", (status) => finish(status));

    if (timeoutMs) {
      timeoutHandle = setTimeout(() => {
        timedOut = true;
        console.error(
          `Lingo command exceeded its ${timeoutMinutes}-minute time limit; stopping it.`,
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

function extractFailedPushPaths(output) {
  // Lingo uses ANSI color codes in the failure report.
  // eslint-disable-next-line no-control-regex
  const normalizedOutput = output.replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, "");
  const failedPaths = new Set();
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
      failedPaths.add(match[0]);
    }
  }

  return [...failedPaths];
}

function extractFailedSourcePatterns(output) {
  return [
    ...new Set(
      extractFailedPushPaths(output).map(sourcePathFromTarget).filter(Boolean),
    ),
  ];
}

function extractFailedTargetPaths(output) {
  return extractFailedPushPaths(output).filter((failedPath) => {
    const sourcePath = sourcePathFromTarget(failedPath);
    return sourcePath !== null && sourcePath !== failedPath;
  });
}

function hashFileIfExists(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  if (!fs.existsSync(absolutePath)) {
    return undefined;
  }

  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(absolutePath))
    .digest("hex");
}

async function recoverFailedPush(failedResult) {
  // Snapshot the targets the CLI reported as failed so a confirmed recovery
  // only clears the failure once those exact files were created or rewritten.
  const failedTargetPaths = extractFailedTargetPaths(failedResult.output);
  const failedTargetHashes = new Map(
    failedTargetPaths.map((targetPath) => [
      targetPath,
      hashFileIfExists(targetPath),
    ]),
  );

  const resumeResult = await runLingo(["resume"]);

  if (resumeResult.status !== 0) {
    console.error(
      "Lingo resume was not available; attempting to pull the same run anyway.",
    );
  }

  const pullResult = await runLingo(["pull"]);

  if (pullResult.status !== 0) {
    return failedResult;
  }

  // Lingo's target report is the only authoritative completeness signal for
  // MDX. A pull can rewrite a failed target (and its lock hash) with partial
  // output, while the repository-level coverage check can only establish that
  // the file exists. Keep those recovered files for the next run, but do not
  // turn a reported MDX failure into a successful localization run.
  const failedMdxTargets = failedTargetPaths.filter((targetPath) =>
    targetPath.endsWith(".mdx"),
  );
  if (failedMdxTargets.length > 0) {
    console.error(
      `The failed push reported ${failedMdxTargets.length} MDX target(s); keeping the failed push status because recovery cannot verify translation completeness.`,
    );
    for (const targetPath of failedMdxTargets.slice(0, 20)) {
      console.error(`- failed MDX target: ${targetPath}`);
    }
    return failedResult;
  }

  // Only a completed resume proves the interrupted run finished; a bare pull
  // may fetch partial output, and a rewritten target file is not proof of a
  // complete translation.
  if (resumeResult.status !== 0) {
    console.error(
      "The recovery pull salvaged completed outputs but could not confirm the run finished; keeping the failed push status.",
    );
    return failedResult;
  }

  if (failedTargetPaths.length > 0) {
    const unrecoveredTargets = failedTargetPaths.filter((targetPath) => {
      const recoveredHash = hashFileIfExists(targetPath);
      return (
        recoveredHash === undefined ||
        recoveredHash === failedTargetHashes.get(targetPath)
      );
    });

    if (unrecoveredTargets.length > 0) {
      console.error(
        `The recovery pull left ${unrecoveredTargets.length} failed target(s) unrecovered; keeping the failed push status.`,
      );
      for (const targetPath of unrecoveredTargets.slice(0, 20)) {
        console.error(`- unrecovered target: ${targetPath}`);
      }
      return failedResult;
    }
  }

  return pullResult;
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

  // The coverage guard and backfill are deliberately repo-wide: incremental
  // pushes are always config-wide (see above), so any gap they surface was
  // already inside this run's blast radius regardless of the requested scope.
  if (verifyTargetCoverage() !== 0) {
    console.error(
      "Lingo left target coverage incomplete; retrying once in backfill mode.",
    );
    const retryResult = await runLingoPush(["--backfill-missing"]);
    if (retryResult.status !== 0) {
      process.exit(retryResult.status);
    }
    if (verifyTargetCoverage() !== 0) {
      console.error(
        "Lingo target coverage is still incomplete after the backfill retry.",
      );
      process.exit(1);
    }
  }

  // Config-wide pushes and backfills can rewrite docs targets under any
  // requested scope, so always normalize and verify the docs output.
  verifyDocsOutput();
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

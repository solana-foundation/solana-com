#!/usr/bin/env node
// The one check command. CI's `check` job and local runs both call it, so a
// green run here means the same thing in both places.
//
//   pnpm check              every workspace (what main and the merge queue run)
//   pnpm check --affected   only what the diff against main can reach (PRs)
//
// Every step runs even when an earlier one fails, so a single run lists every
// failure instead of stopping at the first.
import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync } from "node:fs";

const affected = process.argv.includes("--affected");
const inActions = process.env.GITHUB_ACTIONS === "true";

const env = { ...process.env };
if (affected && !env.TURBO_SCM_BASE) {
  // Turbo's default base is the local `main` branch, which is often stale.
  // Compare against where this branch left origin/main instead.
  try {
    env.TURBO_SCM_BASE = execFileSync(
      "git",
      ["merge-base", "origin/main", "HEAD"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
  } catch {
    // Stop rather than guess a base: a wrong one would check too little.
    console.error(
      "pnpm check --affected compares this branch with origin/main, which " +
        "this clone does not have.\nFetch it with `git fetch origin main`, " +
        "or run `pnpm check` to check every workspace.",
    );
    process.exit(1);
  }
}

function turbo(task, ...extra) {
  return [
    "pnpm",
    "exec",
    "turbo",
    "run",
    task,
    "--framework-inference=false",
    // Keep going past a failing workspace so every failure is reported.
    "--continue",
    ...(affected ? ["--affected"] : []),
    ...extra,
  ];
}

const steps = [
  { name: "CSS Modules", cmd: ["node", "scripts/check-new-css-modules.mjs"] },
  {
    name: "i18n script tests",
    cmd: ["node", "--test", "scripts/i18n/*.test.mjs"],
  },
  {
    name: "ICU apostrophes",
    cmd: ["node", "scripts/i18n/verify-icu-apostrophes.mjs"],
  },
  { name: "Format", cmd: ["pnpm", "exec", "oxfmt", "--check", "."] },
  { name: "Lint", cmd: turbo("lint") },
  { name: "Type check", cmd: turbo("check-types") },
  {
    // docs-examples tests need Rust, Go and Python toolchains; the
    // "Docs examples" workflow runs them.
    name: "Tests",
    cmd: turbo("test", "--filter=!@workspace/docs-examples"),
  },
];

const results = [];
for (const step of steps) {
  const [command, ...args] = step.cmd;
  if (inActions) console.log(`::group::${step.name}`);
  else console.log(`\n── ${step.name}: ${step.cmd.join(" ")}`);
  const started = performance.now();
  const { status, error } = spawnSync(command, args, {
    stdio: "inherit",
    env,
    // pnpm is a .cmd shim on Windows, which needs a shell to launch.
    shell: process.platform === "win32",
  });
  const seconds = (performance.now() - started) / 1000;
  if (inActions) console.log("::endgroup::");
  if (error) console.error(`${step.name}: ${error.message}`);
  results.push({ name: step.name, ok: status === 0, seconds });
}

const failed = results.filter((result) => !result.ok);
const total = results.reduce((sum, result) => sum + result.seconds, 0);

console.log(`\nCheck summary (${affected ? "affected" : "all workspaces"})`);
for (const { name, ok, seconds } of results) {
  console.log(
    `  ${ok ? "pass" : "FAIL"}  ${name.padEnd(18)} ${seconds.toFixed(1)}s`,
  );
}
console.log(`  total ${total.toFixed(1)}s`);

if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = results.map(
    ({ name, ok, seconds }) =>
      `| ${name} | ${ok ? "pass" : "**FAIL**"} | ${seconds.toFixed(1)} |`,
  );
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    [
      `### Check (${affected ? "affected" : "all workspaces"})`,
      "",
      "| Step | Result | Seconds |",
      "|---|---|---|",
      ...rows,
      `| Total | ${failed.length ? "**FAIL**" : "pass"} | ${total.toFixed(1)} |`,
      "",
    ].join("\n"),
  );
}

if (failed.length) {
  console.error(`\nFailed: ${failed.map((result) => result.name).join(", ")}`);
  process.exit(1);
}

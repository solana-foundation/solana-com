import { spawnSync } from "node:child_process";
import fs from "node:fs";

const isAffected = process.argv.includes("--affected");
const turboFlags = isAffected ? ["--affected"] : [];

const checks = [
  {
    name: "Format (oxfmt)",
    command: "pnpm",
    args: ["exec", "oxfmt", "--check", "."],
  },
  {
    name: "CSS Modules guard",
    command: "node",
    args: ["scripts/check-new-css-modules.mjs"],
  },
  {
    name: "i18n script unit tests",
    command: "node",
    args: ["--test", "scripts/i18n/*.test.mjs"],
  },
  {
    name: "i18n ICU apostrophes verify",
    command: "node",
    args: ["scripts/i18n/verify-icu-apostrophes.mjs"],
  },
  {
    name: "Lint (turbo)",
    command: "pnpm",
    args: [
      "exec",
      "turbo",
      "run",
      "lint",
      ...turboFlags,
      "--framework-inference=false",
    ],
  },
  {
    name: "Type check (turbo)",
    command: "pnpm",
    args: [
      "exec",
      "turbo",
      "run",
      "check-types",
      ...turboFlags,
      "--framework-inference=false",
    ],
  },
  {
    name: "Unit tests (turbo)",
    command: "pnpm",
    args: [
      "exec",
      "turbo",
      "run",
      "test",
      ...turboFlags,
      "--filter=!@workspace/docs-examples",
      "--framework-inference=false",
    ],
  },
];

console.log(
  `\n🚀 Running unified CI checks (${isAffected ? "affected workspaces" : "all workspaces"})...\n`,
);

const results = [];
let hasFailure = false;

for (const check of checks) {
  console.log(`\n==================================================`);
  console.log(`▶ Starting: ${check.name}`);
  console.log(`  $ ${check.command} ${check.args.join(" ")}`);
  console.log(`==================================================\n`);

  const startTime = Date.now();
  const res = spawnSync(check.command, check.args, {
    stdio: "inherit",
    env: process.env,
  });
  const durationMs = Date.now() - startTime;
  const durationSec = (durationMs / 1000).toFixed(2);
  const passed = res.status === 0;

  if (!passed) {
    hasFailure = true;
  }

  results.push({
    name: check.name,
    passed,
    exitCode: res.status ?? (res.signal ? `signal ${res.signal}` : 1),
    durationSec,
  });
}

// Print summary to console
console.log(`\n==================================================`);
console.log(`📊 Check Summary:`);
console.log(`==================================================`);

for (const r of results) {
  const icon = r.passed ? "✔" : "✖";
  const status = r.passed ? "PASSED" : `FAILED (code ${r.exitCode})`;
  console.log(
    `  ${icon} ${r.name.padEnd(32)} ${status.padEnd(20)} (${r.durationSec}s)`,
  );
}

console.log(`==================================================\n`);

// Append summary to GITHUB_STEP_SUMMARY if running in GitHub Actions
if (process.env.GITHUB_STEP_SUMMARY) {
  try {
    let md = `### CI Check Results (${isAffected ? "affected" : "full"})\n\n`;
    md += `| Check | Status | Duration |\n`;
    md += `| :--- | :---: | :---: |\n`;
    for (const r of results) {
      const badge = r.passed ? "✅ Passed" : `❌ Failed (${r.exitCode})`;
      md += `| ${r.name} | ${badge} | ${r.durationSec}s |\n`;
    }
    md += `\n**Overall Result**: ${hasFailure ? "❌ One or more checks failed" : "✅ All checks passed"}\n`;
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md, "utf8");
  } catch (err) {
    console.error("Failed to write to GITHUB_STEP_SUMMARY:", err);
  }
}

if (hasFailure) {
  console.error("❌ Unified CI checks failed.");
  process.exit(1);
} else {
  console.log("✅ All unified CI checks passed successfully.");
  process.exit(0);
}

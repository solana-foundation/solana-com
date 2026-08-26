#!/usr/bin/env node
/**
 * Reads the JSON report written by the guide walkthrough agent, prints a
 * summary (and a GitHub job summary when available), and exits non-zero if
 * the guide failed or no usable report was produced.
 *
 * Usage: node check-report.mjs <path-to-report.json>
 */
import { readFileSync, existsSync, appendFileSync } from "node:fs";

const reportPath = process.argv[2];

function summarize(markdown) {
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown + "\n");
  }
}

function fail(message) {
  console.error(`✗ ${message}`);
  summarize(`### Guide check failed\n\n${message}`);
  process.exit(1);
}

if (!reportPath) fail("No report path given to check-report.mjs");
if (!existsSync(reportPath)) {
  fail(
    `The walkthrough agent did not produce a report at ${reportPath}. ` +
      "Treating the run as failed — check the agent logs above.",
  );
}

let report;
try {
  report = JSON.parse(readFileSync(reportPath, "utf8"));
} catch (err) {
  fail(`Report at ${reportPath} is not valid JSON: ${err.message}`);
}

const { guide = "(unknown guide)", status, summary = "", issues = [] } = report;
// Any real defect in the guide fails CI; only pure environment noise
// (network flakiness, missing third-party credentials) is tolerated.
const defects = issues.filter((i) => i.severity !== "environment");
const envNotes = issues.filter((i) => i.severity === "environment");

const lines = [`### Guide walkthrough: \`${guide}\``, "", summary, ""];
for (const issue of issues) {
  lines.push(
    `- **${issue.severity}** — ${issue.section}: ${issue.description}`,
    issue.evidence ? `  - Evidence: ${issue.evidence}` : "",
    issue.suggested_fix ? `  - Suggested fix: ${issue.suggested_fix}` : "",
  );
}
const body = lines.filter(Boolean).join("\n");
console.log(body);

if (status === "fail" || defects.length > 0) {
  summarize(`${body}\n\n**Result: FAIL** (${defects.length} guide issue(s))`);
  process.exit(1);
}
if (status !== "pass") {
  fail(`Report has unexpected status ${JSON.stringify(status)}`);
}
summarize(
  `${body}\n\n**Result: PASS** (${envNotes.length} environment note(s))`,
);

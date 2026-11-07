import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  failedStructuralTargets,
  mdxSourceRoots,
  removeFailedTargets,
} from "./recover-structural-mismatch.mjs";

const source = "apps/docs/content/docs/en/example.mdx";
const target = "apps/docs/content/docs/zh/example.mdx";
const otherSource = "apps/docs/content/docs/en/other.mdx";
const otherTarget = "apps/docs/content/docs/zh/other.mdx";
const jsonTarget = "packages/i18n/messages/web/zh/common.json";
const config = {
  sourceLocale: "en",
  targetLocales: ["ar", "vi", "zh"],
  files: [
    { pattern: "packages/i18n/messages/web/en/*.json" },
    {
      pattern: "apps/docs/content/docs/en/**/*.mdx",
      exclude: ["apps/docs/content/docs/en/rpc/**/*.mdx"],
    },
    { pattern: "apps/web/content/learn/en/**/*.mdx" },
    { pattern: "apps/docs/content/developers-learn/en/**/*.mdx" },
    { pattern: "apps/docs/content/docs/en/**/meta.json" },
  ],
};
const structuralLine = (sourcePath, targetPath) =>
  `    ${targetPath}: Failed to plan ${sourcePath}: Cannot safely update ${sourcePath} (mdx) because the source and target document structures are not aligned (unit 14 is jsx-children:11 in the source but jsx-children:11.0 in the target). Force a full retranslation of this file to reset it.`;
const failureReport = (lines) =>
  `  ${lines.length} target(s) failed:\n${lines.join("\n")}\n\n  Error: ${lines.length} target(s) failed during run lrg_example`;

// Verbatim lines from workflow run 42063038540 (5 Nov 2026, Lingo CLI 1.16.0).
const run42063038540 = {
  x402Target: "apps/docs/content/docs/ar/tools/x402-facilitator.mdx",
  x402Source: "apps/docs/content/docs/en/tools/x402-facilitator.mdx",
  learnTarget: "apps/web/content/learn/ar/what-is-solana.mdx",
  learnSource: "apps/web/content/learn/en/what-is-solana.mdx",
  solanaPayTarget:
    "apps/docs/content/docs/vi/tools/commerce-kit/quickstart/solana-pay.mdx",
  solanaPaySource:
    "apps/docs/content/docs/en/tools/commerce-kit/quickstart/solana-pay.mdx",
  mppTarget: "apps/docs/content/docs/ar/payments/agentic-payments/mpp.mdx",
  mppSource: "apps/docs/content/docs/en/payments/agentic-payments/mpp.mdx",
};
const run42063038540Lines = [
  `    ${run42063038540.x402Target}: Failed to plan ${run42063038540.x402Source}: Cannot safely update ${run42063038540.x402Source} (mdx) because the source and target document structures are not aligned (unit 1 is frontmatter:seoTitle in the source but frontmatter:description in the target). Force a full retranslation of this file to reset it.`,
  `    ${run42063038540.learnTarget}: Failed to plan ${run42063038540.learnSource}: Cannot safely update ${run42063038540.learnSource} (mdx) because the source and target document structures are not aligned (unit 15 is paragraph:8 in the source but paragraph:9 in the target). Force a full retranslation of this file to reset it.`,
  `    ${run42063038540.solanaPayTarget}: Failed to plan ${run42063038540.solanaPaySource}: Cannot safely update ${run42063038540.solanaPaySource} (mdx) because the source and target document structures are not aligned (unit 80 is heading:61 in the source but paragraph:60.4.0 in the target). Force a full retranslation of this file to reset it.`,
  `    ${run42063038540.mppTarget}: Failed to plan ${run42063038540.mppSource}: Cannot safely update ${run42063038540.mppSource} (mdx), unit paragraph:34.4.0: inline structures do not correspond unambiguously between the previous source and target. Align the affected markup or explicitly retranslate this file. Existing wording has not been changed.`,
];
const esc = String.fromCharCode(27);
const run42063038540Output = [
  `✓ Run lrg_hPI0UpJL58DL6Gv2twpx: localized 422 target file(s), 10 already up-to-date, uploaded 19 new artifact(s).`,
  `  ${run42063038540Lines.length} target(s) failed:`,
  ...run42063038540Lines,
  "",
  `  ${esc}[31mError:${esc}[39m ${run42063038540Lines.length} target(s) failed during run lrg_hPI0UpJL58DL6Gv2twpx`,
].join("\n");

function fixture(t, extraFiles = []) {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "lingo-recovery-"));
  t.after(() => fs.rmSync(rootDir, { recursive: true, force: true }));
  for (const file of [
    source,
    target,
    otherSource,
    otherTarget,
    jsonTarget,
    ...extraFiles,
  ]) {
    fs.mkdirSync(path.dirname(path.join(rootDir, file)), { recursive: true });
    fs.writeFileSync(path.join(rootDir, file), "content");
  }
  fs.mkdirSync(path.join(rootDir, ".lingo"));
  fs.writeFileSync(
    path.join(rootDir, ".lingo/lock.json"),
    JSON.stringify({
      version: 1,
      files: {
        [source]: {},
        [target]: {},
        [otherSource]: {},
        [otherTarget]: {},
        [jsonTarget]: {},
      },
    }),
  );
  return rootDir;
}

test("derives MDX content roots from the Lingo config", () => {
  assert.deepEqual(mdxSourceRoots(config), [
    "apps/docs/content/docs",
    "apps/web/content/learn",
    "apps/docs/content/developers-learn",
  ]);
  assert.deepEqual(
    mdxSourceRoots({ sourceLocale: "en", files: [config.files[0]] }),
    [],
  );
});

test("recovers only a reported MDX structure failure", (t) => {
  const rootDir = fixture(t);
  const structuralFailure = failureReport([structuralLine(source, target)]);

  assert.deepEqual(
    failedStructuralTargets(structuralFailure, config, rootDir),
    [target],
  );
  assert.deepEqual(
    failedStructuralTargets(
      structuralFailure.replace("1 target(s) failed:", "2 target(s) failed:"),
      config,
      rootDir,
    ),
    [],
  );
  assert.deepEqual(
    failedStructuralTargets(
      structuralFailure.replace(
        "source and target document structures are not aligned",
        "engine is unavailable",
      ),
      config,
      rootDir,
    ),
    [],
  );

  const lockPath = path.join(rootDir, ".lingo/lock.json");
  const lockBefore = fs.readFileSync(lockPath, "utf8");
  removeFailedTargets([target], rootDir);
  assert.equal(fs.existsSync(path.join(rootDir, target)), false);
  assert.equal(fs.existsSync(path.join(rootDir, otherTarget)), true);
  assert.equal(fs.existsSync(path.join(rootDir, jsonTarget)), true);
  assert.equal(fs.readFileSync(lockPath, "utf8"), lockBefore);
  const lock = JSON.parse(lockBefore);
  assert.equal(target in lock.files, true);
  assert.equal(otherTarget in lock.files, true);
  assert.equal(jsonTarget in lock.files, true);
});

test("recovers multiple structural failures but rejects a mixed report", (t) => {
  const rootDir = fixture(t);
  const structuralLines = [
    structuralLine(source, target),
    structuralLine(otherSource, otherTarget),
  ];

  assert.deepEqual(
    failedStructuralTargets(failureReport(structuralLines), config, rootDir),
    [target, otherTarget],
  );
  assert.deepEqual(
    failedStructuralTargets(
      failureReport([
        ...structuralLines,
        `    ${jsonTarget}: engine unavailable`,
      ]),
      config,
      rootDir,
    ),
    [],
  );
  assert.equal(fs.existsSync(path.join(rootDir, target)), true);
  assert.equal(fs.existsSync(path.join(rootDir, otherTarget)), true);
});

test("recognises the run 42063038540 report: learn targets, frontmatter drift, and inline-structure drift", (t) => {
  const rootDir = fixture(t, Object.values(run42063038540));

  assert.deepEqual(
    failedStructuralTargets(run42063038540Output, config, rootDir),
    [
      run42063038540.x402Target,
      run42063038540.learnTarget,
      run42063038540.solanaPayTarget,
      run42063038540.mppTarget,
    ],
  );
});

test("rejects structure failures whose target is outside the configured MDX roots", (t) => {
  const foreignSource = "apps/media/content/en/post.mdx";
  const foreignTarget = "apps/media/content/zh/post.mdx";
  const rootDir = fixture(t, [foreignSource, foreignTarget]);

  assert.deepEqual(
    failedStructuralTargets(
      failureReport([
        structuralLine(source, target),
        structuralLine(foreignSource, foreignTarget),
      ]),
      config,
      rootDir,
    ),
    [],
  );
  assert.deepEqual(
    failedStructuralTargets(
      failureReport([structuralLine(source, target)]),
      { ...config, files: [config.files[0]] },
      rootDir,
    ),
    [],
  );
});

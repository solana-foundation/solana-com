/**
 * Runnable examples.
 *
 * - `build-examples.ts [--check]`: blocks.json + recorded `.output.txt`
 *   -> apps/docs/content/snippets/examples/**.mdx + index.json.
 * Blocks without recorded output get no Run button.
 *
 * `runExamples` is what `docs-tooling examples [--check]` calls. It is
 * synchronous and THROWS on errors or (with --check) stale output, so the CLI
 * exits non-zero.
 */
import { buildExamples, type BuildResult } from "./build-examples.ts";

export interface ExamplesOptions {
  check?: boolean;
}

function summarize(r: BuildResult, check: boolean): string {
  const lines = [
    `examples: ${Object.keys(r.index).length} blocks, ${r.outputsEmbedded} recorded outputs embedded`,
  ];
  for (const n of r.notes) lines.push(`  note ${n}`);
  for (const e of r.errors) lines.push(`  ERROR ${e}`);
  if (check) {
    if (r.stale.length) {
      lines.push(
        `  ${r.stale.length} generated file(s) are stale; run \`examples:build\`:`,
      );
      for (const s of r.stale) lines.push(`    ${s}`);
    } else lines.push("  snippets are up to date");
  } else {
    lines.push(`  wrote ${r.written.length}, removed ${r.removed.length}`);
  }
  return lines.join("\n");
}

export function runExamples(opts: ExamplesOptions = {}): {
  implemented: true;
  ok: boolean;
  message: string;
  result: BuildResult;
} {
  const check = Boolean(opts.check);
  const result = buildExamples({ check, write: !check });
  const message = summarize(result, check);
  const ok =
    result.errors.length === 0 && (!check || result.stale.length === 0);
  if (!ok) throw new Error(message);
  return { implemented: true, ok, message, result };
}

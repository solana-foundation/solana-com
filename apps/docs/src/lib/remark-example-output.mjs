import { readFile } from "node:fs/promises";
import { dirname, extname, isAbsolute, join } from "node:path";

/**
 * Attaches the expected output of a runnable code block to its fence meta.
 *
 * Runnable blocks (`<CodeTabs flags="r">`) show a console with a Run button.
 * Instead of executing anything, the console prints text captured from the real
 * example. That text lives next to the example source so it stays reviewable
 * alongside the code it documents:
 *
 *   packages/docs-examples/cookbook/development/test-sol/kit.ts
 *   packages/docs-examples/cookbook/development/test-sol/kit.airdrop.output.txt
 *   packages/docs-examples/cookbook/development/test-sol/kit.output.txt
 *
 * For a fence with `file=<path>#region=<name>` the plugin looks for
 * `<path-without-ext>.<region>.output.txt` first, then `<path-without-ext>.output.txt`.
 * Blocks with inline code (no `file=`) opt in with `output=<path>`, which is
 * also how a block overrides discovery.
 *
 * The resolved text is baked into the meta as `output=<base64url>` so it is a
 * single whitespace-free token, and so nothing has to touch the filesystem at
 * render time. `Code` decodes it in `toCodeGroup`.
 *
 * Must run BEFORE `@devrelkit/remark-include-code`, which consumes the `file=`
 * token this plugin reads (it leaves unknown tokens such as `output=` alone).
 */
const remarkExampleOutput = (options = {}) => {
  const { rootDir } = options;

  return async (tree, file) => {
    const tasks = [];

    eachCodeNode(tree, null, (node, parent) => {
      const meta = node.meta ?? "";
      const baseDir = rootDir ?? dirname(file.path || file.cwd);

      const explicit = meta.match(OUTPUT_RE);
      if (explicit) {
        tasks.push(async () => {
          const path = explicit[1];
          const text = await readOutput(resolvePath(path, baseDir));
          if (text === null) {
            throw new OutputError(
              `cannot read output file "${path}"`,
              file.path || "<unknown>",
            );
          }
          node.meta = meta.replace(OUTPUT_RE, ` output=${encode(text)}`).trim();
        });
        return;
      }

      // Only runnable blocks render a console, so only they need an output.
      if (!isRunnable(node, parent)) return;

      const source = meta.match(FILE_RE);
      if (!source) return;

      tasks.push(async () => {
        const { filePath, region } = splitFileAndRegion(source[1]);
        for (const candidate of outputCandidates(filePath, region)) {
          const text = await readOutput(resolvePath(candidate, baseDir));
          if (text === null) continue;
          node.meta = `${meta} output=${encode(text)}`;
          return;
        }
      });
    });

    await Promise.all(tasks.map((task) => task()));
  };
};

const OUTPUT_RE = /(?:^|\s)output=(\S+)/;
const FILE_RE = /(?:^|\s)file=(\S+)/;

/**
 * Walks the tree, handing every fence to `visitor` along with its parent — the
 * parent is what carries the `flags` attribute when the fence sits inside a
 * `<CodeTabs>`. Hand-rolled so this plugin needs no dependency of its own:
 * apps/docs does not depend on unist-util-visit, and esbuild leaves packages
 * external when it bundles source.config.ts.
 */
function eachCodeNode(node, parent, visitor) {
  if (node.type === "code") {
    visitor(node, parent);
    return;
  }
  for (const child of node.children ?? []) {
    eachCodeNode(child, node, visitor);
  }
}

class OutputError extends Error {
  constructor(message, source) {
    super(`${message} (in ${source})`);
    this.source = source;
    this.name = "OutputError";
  }
}

/**
 * A block is runnable when its `<CodeTabs>` wrapper carries the `r` flag, or
 * when the fence itself does (`\`\`\`ts !! -r`).
 */
function isRunnable(node, parent) {
  const fenceFlags = (node.meta ?? "")
    .split(" ")
    .filter((token) => token.startsWith("-"));
  if (fenceFlags.some((flag) => flag.includes("r"))) return true;

  if (parent?.type !== "mdxJsxFlowElement") return false;
  const flags = parent.attributes?.find(
    (attribute) =>
      attribute.type === "mdxJsxAttribute" && attribute.name === "flags",
  );
  return typeof flags?.value === "string" && flags.value.includes("r");
}

function outputCandidates(filePath, region) {
  const withoutExtension = filePath.slice(
    0,
    filePath.length - extname(filePath).length,
  );
  const candidates = [];
  if (region) candidates.push(`${withoutExtension}.${region}.output.txt`);
  candidates.push(`${withoutExtension}.output.txt`);
  return candidates;
}

function splitFileAndRegion(value) {
  const hash = value.indexOf("#");
  if (hash === -1) return { filePath: value, region: null };

  const filePath = value.slice(0, hash);
  const fragment = value.slice(hash + 1);
  const eq = fragment.indexOf("=");
  if (eq === -1) return { filePath, region: fragment || null };

  const key = fragment.slice(0, eq);
  const val = fragment.slice(eq + 1);
  return { filePath, region: key === "region" && val ? val : null };
}

function resolvePath(path, baseDir) {
  return isAbsolute(path) ? path : join(baseDir, path);
}

/** Returns the file's contents, or null when it does not exist. */
async function readOutput(absolute) {
  try {
    const text = await readFile(absolute, "utf8");
    return text.replace(/\s+$/, "");
  } catch {
    return null;
  }
}

function encode(text) {
  return Buffer.from(text, "utf8").toString("base64url");
}

export default remarkExampleOutput;

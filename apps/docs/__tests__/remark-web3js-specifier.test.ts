import { resolve } from "node:path";
import remarkIncludeCode from "@devrelkit/remark-include-code";
import { describe, expect, it } from "vitest";
import remarkWeb3jsSpecifier from "../src/lib/remark-web3js-specifier.mjs";

const rootDir = resolve(__dirname, "..", "..", "..");

type CodeNode = { type: "code"; lang: string; meta: string; value: string };

function code(value: string, meta = ""): CodeNode {
  return { type: "code", lang: "ts", meta, value };
}

function tabs(...children: CodeNode[]) {
  return {
    type: "root",
    children: [{ type: "mdxJsxFlowElement", name: "CodeTabs", children }],
  };
}

describe("remarkWeb3jsSpecifier", () => {
  it("rewrites both aliases to the published package name", () => {
    const v3 = code(`import { Keypair } from "@solana/web3.js-v3";`);
    const legacy = code(
      `import { Connection } from '@solana/web3.js-legacy';\nimport x from "@solana/web3.js-legacy/lib/index.cjs";`,
    );

    remarkWeb3jsSpecifier()(tabs(v3, legacy));

    expect(v3.value).toBe(`import { Keypair } from "@solana/web3.js";`);
    expect(legacy.value).toBe(
      `import { Connection } from '@solana/web3.js';\nimport x from "@solana/web3.js/lib/index.cjs";`,
    );
  });

  it("leaves other specifiers untouched", () => {
    const source = [
      `import { address } from "@solana/kit";`,
      `import { getMint } from "@solana/spl-token";`,
      `import { Connection } from "@solana/web3.js";`,
      `import { x } from "@solana/web3.js-v3-extras";`,
      `import { y } from "@solana/web3.js-legacyish";`,
    ].join("\n");
    const node = code(source);

    remarkWeb3jsSpecifier()(tabs(node));

    expect(node.value).toBe(source);
  });

  it("rewrites the source inlined by remark-include-code", async () => {
    const node = code(
      "",
      "!! file=packages/docs-examples/cookbook/development/test-sol/legacy.ts#region=airdrop",
    );
    const tree = tabs(node);
    const file = { path: "test.mdx", cwd: rootDir };

    const includeCode = remarkIncludeCode as unknown as (options: {
      rootDir: string;
    }) => (tree: unknown, file: unknown) => Promise<void>;

    await includeCode({ rootDir })(tree, file);
    remarkWeb3jsSpecifier()(tree);

    expect(node.value).toContain(`from "@solana/web3.js";`);
    expect(node.value).not.toMatch(/@solana\/web3\.js-(v3|legacy)/);
  });
});

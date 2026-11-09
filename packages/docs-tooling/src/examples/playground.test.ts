import { describe, expect, it } from "vitest";
import { buildExamples } from "./build-examples.ts";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { inflateRawSync } from "node:zlib";
import {
  detectProgramKind,
  encodePlaygroundCode,
  folderKind,
  PLAYGROUND_MAX_BYTES,
  PLAYGROUND_PROGRAMS,
  PLAYGROUND_RUN_FILE,
  PLAYGROUND_SCRIPT,
  playgroundOrigin,
  playgroundScriptProblems,
} from "./playground.ts";
import {
  buildPathOutputs,
  examplesRoot,
  PATH_UI,
  renderPlaygroundBlock,
  renderStepper,
  tutorialDir,
  tutorialSource,
  type PathDef,
} from "../generators/paths.ts";
import type { Problem } from "../generators/_lib.ts";
import { docsRoot } from "../lib/paths.ts";

describe("playground kinds (mirror of Playground's GitHub import)", () => {
  it("detects Native and Anchor programs like Playground does", () => {
    const native = "use solana_program::entrypoint;\nentrypoint!(process);";
    const anchor = "use anchor_lang::prelude::*;\n#[program]\npub mod x {}";
    expect(detectProgramKind([["src/lib.rs", native]])).toBe("native");
    expect(detectProgramKind([["programs/x/src/lib.rs", anchor]])).toBe(
      "anchor",
    );
    // A Python script next to the program (fuzzing, tooling) keeps Anchor;
    // only a Seahorse program (`seahorse.prelude`) rules it out.
    expect(
      detectProgramKind([
        ["programs/x/src/lib.rs", anchor],
        ["x.py", "print()"],
      ]),
    ).toBe("anchor");
    expect(
      detectProgramKind([
        ["programs/x/src/lib.rs", anchor],
        ["src/x.py", "from seahorse.prelude import *"],
      ]),
    ).toBe("seahorse");
    // Detected, but convertToPlayground keeps nothing outside src/: fails.
    expect(detectProgramKind([["lib.rs", native]])).toBeUndefined();
  });

  it("leaves client code (TS, Rust binaries, Python) undetected", () => {
    expect(detectProgramKind([["kit.ts", "import x"]])).toBeUndefined();
    expect(
      detectProgramKind([["src/main.rs", "fn main() {}"]]),
    ).toBeUndefined();
    expect(detectProgramKind([["a.py", "import solders"]])).toBeUndefined();
  });
});

describe("folder kinds", () => {
  let root: string;
  const write = (rel: string, text: string) => {
    mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    writeFileSync(path.join(root, rel), text);
  };
  it("uses the framework, else the most common language", () => {
    root = mkdtempSync(path.join(os.tmpdir(), "pg-kind-"));
    try {
      write("a/x.ts", "");
      write("a/y.ts", "");
      write("a/z.py", "");
      write("a/package.json", "{}");
      expect(folderKind(path.join(root, "a"))).toBe("ts");
      write("b/z.py", "");
      write("b/y.ts", "");
      // Tie: ts wins over py.
      expect(folderKind(path.join(root, "b"))).toBe("ts");
      write("c/src/lib.rs", "entrypoint!(p);");
      write("c/client/a.ts", "");
      write("c/client/b.ts", "");
      expect(folderKind(path.join(root, "c"))).toBe("native");
      write("d/README.md", "");
      expect(folderKind(path.join(root, "d"))).toBe("other");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("Open tutorial in Playground (gen:paths)", () => {
  const def = (key: string, tab: string, demo?: string[]): PathDef => ({
    key,
    tab,
    label: key,
    job: "Job",
    name: "Name",
    time: "~1 min",
    intro: `/developers/docs/${tab}/${key}`,
    steps: [{ href: `/developers/docs/${tab}/${key}/a`, title: "A" }],
    demo: demo && {
      component: "asset",
      title: "T",
      steps: demo.map((output) => ({ label: "x", output })),
    },
  });
  let root: string;
  const touch = (rel: string) => {
    mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    writeFileSync(path.join(root, rel), "");
  };

  it("finds the folder from the demo outputs, else paths/<domain>/<key>", () => {
    root = mkdtempSync(path.join(os.tmpdir(), "pg-tut-"));
    try {
      touch("paths/assets/issue-asset/create-asset.ts");
      touch("paths/defi/settle-trade/price.ts");
      touch("paths/defi/settle-trade/dvp/index.ts");
      touch("paths/defi/settle-trade/blocks.json");
      // Demo outputs decide.
      expect(
        tutorialDir(
          def("issue-asset", "assets", [
            "paths/assets/issue-asset/a.output.txt",
          ]),
          root,
        ),
      ).toBe("paths/assets/issue-asset");
      // A tutorial whose tab is not its folder's domain (settle-trade:
      // tab "markets", folder paths/defi/), with or without a demo.
      expect(tutorialDir(def("settle-trade", "markets"), root)).toBe(
        "paths/defi/settle-trade",
      );
      expect(tutorialSource(def("settle-trade", "markets"), root)).toEqual({
        open: "packages/docs-examples/paths/defi/settle-trade",
        kind: "ts",
      });
      // No folder: no source.
      expect(tutorialSource(def("nope", "markets"), root)).toBeUndefined();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("finds the real tutorial folders", () => {
    expect(tutorialSource(def("checkout", "payments"))).toEqual({
      open: "packages/docs-examples/paths/payments/checkout",
      kind: "ts",
    });
    expect(tutorialSource(def("issue-asset", "assets"))?.open).toBe(
      "packages/docs-examples/paths/assets/issue-asset",
    );
  });

  it("renders the block with a plain button for the folder", () => {
    const src = { lang: "en", ui: PATH_UI, paths: [] };
    const p = def("prog", "programs");
    const pg = {
      open: "packages/docs-examples/paths/a/b",
      kind: "anchor" as const,
    };
    for (const n of [0, 1])
      expect(renderStepper("/nonexistent", src, p, n)).not.toContain("sol-pg");
    const block = renderPlaygroundBlock(src, p, pg);
    expect(block).toContain('<div className="sol-pg-tutorial not-prose"');
    expect(block).toContain(
      `<p className="sol-pg-tutorial-lead">${PATH_UI.playgroundLead}</p>`,
    );
    expect(block).toContain(
      '<a className="sol-pg-tut" data-pg-open="packages/docs-examples/paths/a/b">Open tutorial in Playground</a>',
    );
    expect(block).toContain(PATH_UI.playgroundNote);
    // No href in the markup: playground.js builds it from CONFIG.
    expect(block).not.toMatch(/href=|solpg|github\.com/);
  });
});

describe("no Playground control outside the tutorial block", () => {
  it("generated example snippets carry no markers", () => {
    const r = buildExamples({ check: true });
    for (const [rel, text] of r.files)
      expect(text, rel).not.toMatch(/sol-pg|data-pg-/);
  });

  it("TypeScript tutorials without a playground.ts get no Playground block", () => {
    const src = { lang: "en", ui: PATH_UI, paths: [] as PathDef[] };
    const p: PathDef = {
      key: "checkout",
      tab: "payments",
      label: "c",
      job: "j",
      name: "n",
      time: "t",
      intro: "/developers/docs/payments/checkout",
      steps: [{ href: "/developers/docs/payments/checkout/a", title: "A" }],
      demo: {
        component: "checkout",
        title: "T",
        steps: [
          { label: "Pay", output: "paths/payments/checkout/pay.output.txt" },
        ],
      },
    };
    src.paths.push(p);
    const files = buildPathOutputs("/nonexistent", [src], []);
    const withPg = [...files]
      .filter(([, text]) => /sol-pg|data-pg-/.test(text))
      .map(([f]) => path.basename(f));
    expect(withPg).toEqual([]);
  });

  it("program (Anchor/Native) tutorials get one in playground.mdx, only while PLAYGROUND_PROGRAMS is on", () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "pg-prog-"));
    try {
      const lib = path.join(root, "paths/programs/prog/src/lib.rs");
      mkdirSync(path.dirname(lib), { recursive: true });
      writeFileSync(lib, "#[program]\npub mod prog {}");
      const p: PathDef = {
        key: "prog",
        tab: "programs",
        label: "p",
        job: "j",
        name: "n",
        time: "t",
        intro: "/developers/docs/programs/prog",
        steps: [{ href: "/developers/docs/programs/prog/a", title: "A" }],
      };
      const src = { lang: "en", ui: PATH_UI, paths: [p] };
      const withPg = (programs?: boolean) =>
        [...buildPathOutputs("/nonexistent", [src], [], root, { programs })]
          .filter(([, text]) => /sol-pg|data-pg-/.test(text))
          .map(([f]) => path.basename(f));
      expect(withPg(true)).toEqual(["playground.mdx"]);
      expect(withPg(false)).toEqual([]);
      // The default: off while Playground builds Anchor 0.29 only.
      expect(PLAYGROUND_PROGRAMS).toBe(false);
      expect(withPg()).toEqual([]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("no docs page has a program button while PLAYGROUND_PROGRAMS is off", () => {
    if (PLAYGROUND_PROGRAMS) return;
    const pages = readdirSync(docsRoot, { recursive: true, encoding: "utf8" })
      .filter((f) => f.endsWith(".mdx"))
      .filter((f) =>
        readFileSync(path.join(docsRoot, f), "utf8").includes("data-pg-open"),
      );
    expect(pages).toEqual([]);
  });
});

describe("playground.js (one Playground origin, its /github/ import)", () => {
  const script = readFileSync(PLAYGROUND_SCRIPT, "utf8");

  it("sets one origin for both kinds of button", () => {
    expect(playgroundOrigin()).toMatch(/^https:\/\/[a-z0-9.-]+$/);
    expect(script.match(/^\s*origin:/gm)).toHaveLength(1);
    expect(script).not.toMatch(/runOrigin|beta\.solpg\.io/);
    expect(script).toContain('CONFIG.origin + "/open#"');
  });

  it("builds program links as <origin>/github/<owner>/<repo>/tree/<ref>/<folder>", () => {
    // The old Playground's `/github.com/<source>` form is a 404 on the new one.
    expect(script).toContain(
      'CONFIG.origin + "/github/" + CONFIG.source + "/" + open',
    );
    expect(script).not.toContain('"/github.com/"');
    const source = /^\s*source:\s*"([^"]+)",?\s*$/m.exec(script)?.[1];
    // GitHub's path without the host; the ref has no "/" (Playground's
    // parser stops there).
    expect(source).toMatch(/^[\w-]+\/[\w-]+\/tree\/[\w.-]+$/);
  });
});

/** The query of a generated Run link's fragment. */
const runParams = (block: string) => {
  const href = /href="([^"]+)"/.exec(block)![1]!;
  return { href, params: new URLSearchParams(href.split("#")[1]) };
};
const inflate = (code: string) =>
  inflateRawSync(Buffer.from(code, "base64url")).toString("utf8");

describe("Run in Playground (TypeScript tutorials with a playground.ts)", () => {
  it("encodes a link's code as raw DEFLATE that inflates back exactly", () => {
    for (const text of [
      "",
      "console.log(1)",
      'const s = "ünïcödé, 💸";',
      "x".repeat(0xffff),
      "y".repeat(0xffff + 1),
      "z".repeat(PLAYGROUND_MAX_BYTES),
    ]) {
      const code = encodePlaygroundCode(text);
      expect(code).toMatch(/^[\w-]*$/); // base64url, no padding
      expect(inflate(code)).toBe(text);
      // The same bytes on every machine: --check compares the text.
      expect(encodePlaygroundCode(text)).toBe(code);
    }
  });

  it("refuses what Playground can't run", () => {
    const ok = [
      'import { createClient } from "@solana/kit";',
      'import { signerFromFile } from "@solana/kit-plugin-signer";',
      "const env = { process: 1 }; console.log(env.process);",
    ].join("\n");
    expect(playgroundScriptProblems(ok)).toEqual([]);
    const bad = (code: string) => playgroundScriptProblems(code).join("\n");
    expect(bad('import { client } from "./client";')).toContain(
      "Playground runs one file",
    );
    expect(bad('import { readFileSync } from "node:fs";')).toContain(
      'Node.js module "node:fs"',
    );
    expect(bad('import path from "path";')).toContain('Node.js module "path"');
    expect(
      bad('import { tokenProgram } from "@solana-program/token";'),
    ).toContain("can't load");
    expect(bad('const m = await import("@solana/kit/extra");')).toContain(
      "can't load",
    );
    expect(bad("const url = process.env.RPC_URL;")).toContain(
      "uses process (line 1)",
    );
    // Playground refuses these words anywhere, even inside other words.
    expect(bad("// Stop here, see the top.")).toContain(
      'contains "top" (line 1), which Playground refuses anywhere',
    );
    expect(bad('const where = "document";')).toContain('contains "document"');
    expect(bad("  ")).toContain("is empty");
    expect(bad(`// ${"x".repeat(PLAYGROUND_MAX_BYTES)}`)).toContain(
      "at most 102400",
    );
  });

  it("every playground.ts runs from a link, far under the 100 KiB cap", () => {
    const origin = playgroundOrigin();
    expect(origin).toMatch(/^https:\/\/[a-z0-9.-]+$/);
    const files = readdirSync(path.join(examplesRoot, "paths"), {
      recursive: true,
      encoding: "utf8",
    })
      .filter((f) => path.basename(f) === PLAYGROUND_RUN_FILE)
      .map((f) => path.join(examplesRoot, "paths", f));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const code = readFileSync(file, "utf8");
      expect(playgroundScriptProblems(code), file).toEqual([]);
      // In Playground, signerFromFile is the reader's Playground wallet.
      expect(code, file).toContain('signerFromFile("wallet.json")');
      expect(code, file).toContain("solanaDevnetRpc()");
      // A link a sixth of the cap still pastes and opens anywhere.
      expect(Buffer.byteLength(code), file).toBeLessThan(
        PLAYGROUND_MAX_BYTES / 6,
      );
      const href = `${origin}/open#code=${encodePlaygroundCode(code)}`;
      expect(href.length, file).toBeLessThan(PLAYGROUND_MAX_BYTES / 6);
    }
  });

  it("writes one plain link in playground.mdx, with the file in it", () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "pg-run-"));
    try {
      const code =
        'import { createClient } from "@solana/kit";\nconsole.log(1);\n';
      const dir = path.join(root, "paths/start/q");
      mkdirSync(dir, { recursive: true });
      writeFileSync(path.join(dir, "step.ts"), "export {};\n");
      writeFileSync(path.join(dir, PLAYGROUND_RUN_FILE), code);
      const p: PathDef = {
        key: "q",
        tab: "start",
        label: "q",
        job: "j",
        name: "Quick start",
        time: "t",
        intro: "/developers/docs/q",
        steps: [{ href: "/developers/docs/q/a", title: "A" }],
      };
      expect(tutorialSource(p, root)?.run?.file).toBe(
        "packages/docs-examples/paths/start/q/playground.ts",
      );
      const src = { lang: "en", ui: PATH_UI, paths: [p] };
      const problems: Problem[] = [];
      const files = buildPathOutputs("/nonexistent", [src], problems, root);
      expect(problems).toEqual([]);
      const withPg = [...files].filter(([, t]) => /sol-pg|data-pg-/.test(t));
      expect(withPg.map(([f]) => path.basename(f))).toEqual(["playground.mdx"]);
      const block = withPg[0]![1];
      expect(block).toContain(
        `<p className="sol-pg-tutorial-lead">${PATH_UI.playgroundRunLead}</p>`,
      );
      expect(block).toContain(PATH_UI.playgroundRunNote);
      expect(block).not.toContain("data-pg-open");
      expect(block).toContain(
        ' target="_blank" rel="noopener noreferrer">Run in Playground<span className="sol-vh"> (opens in a new tab)</span></a>',
      );
      const { href, params } = runParams(block);
      expect(href.startsWith(`${playgroundOrigin()}/open#`)).toBe(true);
      expect([...params.keys()]).toEqual([
        "v",
        "name",
        "title",
        "from",
        "sol",
        "code",
      ]);
      expect(params.get("v")).toBe("1");
      expect(params.get("name")).toBe("q.ts");
      expect(params.get("title")).toBe("Quick start");
      expect(params.get("from")).toBe("https://solana.com/developers/docs/q");
      expect(params.get("sol")).toBe("0.02");
      expect(inflate(params.get("code")!)).toBe(code);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("reports a playground.ts that can't run, and writes no block", () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "pg-run-bad-"));
    try {
      const dir = path.join(root, "paths/start/q");
      mkdirSync(dir, { recursive: true });
      writeFileSync(
        path.join(dir, PLAYGROUND_RUN_FILE),
        'import { client } from "./client";\n',
      );
      const p: PathDef = {
        key: "q",
        tab: "start",
        label: "q",
        job: "j",
        name: "n",
        time: "t",
        intro: "/developers/docs/q",
        steps: [{ href: "/developers/docs/q/a", title: "A" }],
      };
      const problems: Problem[] = [];
      const files = buildPathOutputs(
        "/nonexistent",
        [{ lang: "en", ui: PATH_UI, paths: [p] }],
        problems,
        root,
      );
      expect([...files.keys()].some((f) => f.endsWith("playground.mdx"))).toBe(
        false,
      );
      expect(problems).toEqual([
        {
          level: "error",
          file: "packages/docs-examples/paths/start/q/playground.ts",
          message:
            'can\'t run from a Playground link: it imports "./client": Playground runs one file',
        },
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("a program tutorial never gets the Run link, even with a playground.ts", () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "pg-prog-run-"));
    try {
      const dir = path.join(root, "paths/programs/prog");
      mkdirSync(path.join(dir, "src"), { recursive: true });
      writeFileSync(
        path.join(dir, "src/lib.rs"),
        "#[program]\npub mod prog {}",
      );
      writeFileSync(path.join(dir, PLAYGROUND_RUN_FILE), "console.log(1);\n");
      const p: PathDef = {
        key: "prog",
        tab: "programs",
        label: "p",
        job: "j",
        name: "n",
        time: "t",
        intro: "/developers/docs/programs/prog",
        steps: [{ href: "/developers/docs/programs/prog/a", title: "A" }],
      };
      const block = (programs: boolean) =>
        [
          ...buildPathOutputs(
            "/nonexistent",
            [{ lang: "en", ui: PATH_UI, paths: [p] }],
            [],
            root,
            { programs },
          ),
        ].find(([f]) => f.endsWith("playground.mdx"))?.[1];
      // On: its GitHub import. Off (for now): no block at all.
      expect(block(true)).toContain("data-pg-open=");
      expect(block(true)).not.toContain("data-pg-run");
      expect(block(false)).toBeUndefined();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("the Quickstart's block opens its playground.ts", () => {
    const block = readFileSync(
      path.join(docsRoot, "snippets/paths/en/quickstart/playground.mdx"),
      "utf8",
    );
    const { params } = runParams(block);
    expect(params.get("name")).toBe("quickstart.ts");
    expect(params.get("title")).toBe("Quickstart");
    expect(params.get("from")).toBe(
      "https://solana.com/developers/docs/quickstart",
    );
    expect(inflate(params.get("code")!)).toBe(
      readFileSync(
        path.join(examplesRoot, "paths/start/quickstart", PLAYGROUND_RUN_FILE),
        "utf8",
      ),
    );
  });
});

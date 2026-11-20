/**
 * Generators: concepts, paths, addresses.
 * Every test runs against a throwaway docs root in the OS temp dir.
 */
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { docsRoot as realDocsRoot } from "../src/lib/paths.ts";
import { parseConcepts, runConcepts } from "../src/generators/concepts.ts";
import {
  examplesRoot,
  parsePaths,
  PATH_UI,
  renderPlaygroundBlock,
  renderStepper,
  runPaths,
} from "../src/generators/paths.ts";
import { parseAddresses, runAddresses } from "../src/generators/addresses.ts";
import {
  attr,
  mdText,
  plainText,
  readJson,
  type Problem,
} from "../src/generators/_lib.ts";

let root: string;
let outputs: string;

const write = (rel: string, text: string, base = root) => {
  const abs = path.join(base, rel);
  mkdirSync(path.dirname(abs), { recursive: true });
  writeFileSync(abs, text);
};
const read = (rel: string) => readFileSync(path.join(root, rel), "utf8");
const page = (title: string, body: string) =>
  `---\ntitle: ${title}\n---\n\n${body}\n`;

const TRY_IT = page(
  "Pay as a customer",
  `import Stepper from "/snippets/paths/en/checkout/stepper-1.mdx";
import Wallet from "/snippets/concepts/en/wallet.mdx";

<Stepper />

You used <span className="sol-chip" data-concept="clusters">devnet</span>. Also <Tooltip data-concept="account">accounts</Tooltip>.

Mint: <span className="sol-address" data-address="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v">\`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\`</span> and \`TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA\`.

\`\`\`ts
const usdc = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // <span data-concept="rpc">x</span>
\`\`\`

<Wallet />`,
);

beforeEach(() => {
  root = mkdtempSync(path.join(os.tmpdir(), "docs-gen-"));
  outputs = mkdtempSync(path.join(os.tmpdir(), "docs-gen-out-"));
  for (const rel of ["concepts/concepts.en.json", "paths/paths.en.json"]) {
    mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    writeFileSync(
      path.join(root, rel),
      readFileSync(path.join(realDocsRoot, rel)),
    );
  }
  writeFileSync(
    path.join(root, "addresses.json"),
    readFileSync(path.join(realDocsRoot, "addresses.json")),
  );
  write("docs/en/payments/checkout/try-it.mdx", TRY_IT);
  write("docs/en/core/accounts/index.mdx", page("Accounts", "Accounts."));
  write("docs/ja/core/accounts/index.mdx", page("Accounts", "Konten."));
  write(
    "docs/ja/payments/checkout/try-it.mdx",
    page(
      "Try",
      `import W from "/snippets/concepts/en/wallet.mdx";\n\n<W />\n\nSiehe <span className="sol-chip" data-concept="account">Konten</span>.`,
    ),
  );
  write(
    "paths/payments/checkout/pay.output.txt",
    "Signature: 5h3f {x} <y> ```\nok\n",
    outputs,
  );
  write(
    "paths/payments/checkout/pay.run.json",
    JSON.stringify({
      commands: [{ at: 0, cmd: "await payStore(customer, order)" }],
      badges: [{ tone: "ok", label: "Confirmed" }],
    }),
    outputs,
  );
  write(
    "paths/payments/checkout/verify-payment.paid.output.txt",
    "confirmed\n",
    outputs,
  );
  write(
    "paths/payments/checkout/verify-payment.mismatch.output.txt",
    "{ paid: false, reason: 'amount mismatch' }\n",
    outputs,
  );
});
afterEach(() => {
  rmSync(root, { recursive: true, force: true });
  rmSync(outputs, { recursive: true, force: true });
});

const all = (check = false) => ({
  paths: runPaths({ docsRoot: root, check, sync: true, outputsRoot: outputs }),
  concepts: runConcepts({ docsRoot: root, check, sync: true }),
  addresses: runAddresses({ docsRoot: root, check, sync: true }),
});
const errors = (ps: Problem[]) => ps.filter((p) => p.level === "error");

describe("sources and registries", () => {
  it("the concepts, paths, and addresses sources in apps/docs/content validate", () => {
    const problems: Problem[] = [];
    const c = parseConcepts(
      readJson(path.join(realDocsRoot, "concepts", "concepts.en.json")),
      "c",
      problems,
    );
    const p = parsePaths(
      readJson(path.join(realDocsRoot, "paths", "paths.en.json")),
      "p",
      problems,
    );
    const a = parseAddresses(
      readJson(path.join(realDocsRoot, "addresses.json")),
      problems,
    );
    expect(problems).toEqual([]);
    expect(c.concepts).toHaveLength(16);
    expect(p.paths.map((x) => x.key)).toEqual([
      "quickstart",
      "checkout",
      "paywall-api",
      "issue-asset",
      "settle-trade",
    ]);
    expect(a.length).toBeGreaterThan(20);
  });

  it("demo steps point at real example recordings that match their labels", () => {
    const problems: Problem[] = [];
    const p = parsePaths(
      readJson(path.join(realDocsRoot, "paths", "paths.en.json")),
      "p",
      problems,
    );
    const rec = (key: string, i: number) => {
      const d = p.paths.find((x) => x.key === key)!.demo!;
      const f = path.join(examplesRoot, d.steps[i]!.output);
      expect(existsSync(f), f).toBe(true);
      return readFileSync(f, "utf8");
    };
    expect(rec("checkout", 0)).toContain("amount: 1000000n");
    expect(rec("checkout", 1)).toBe("{ paid: true }\n");
    expect(rec("paywall-api", 0)).toMatch(/-> 402/);
    expect(rec("paywall-api", 1)).toMatch(/\(paid\) -> 200/);
    expect(rec("paywall-api", 1)).not.toMatch(/-> 402|refused/);
    expect(rec("issue-asset", 0)).toContain("balance: 1000 LSF");
    expect(rec("issue-asset", 1)).toContain('"Custom":17');
    expect(rec("issue-asset", 2)).toMatch(/^Paused the asset/);
    // Refusals live in the separate checks panel, never in the demo.
    const checks = (key: string, i: number) => {
      const c = p.paths.find((x) => x.key === key)!.demo!.checks!;
      const f = path.join(examplesRoot, c.steps[i]!.output);
      expect(existsSync(f), f).toBe(true);
      return readFileSync(f, "utf8");
    };
    expect(checks("checkout", 0)).toContain("amount mismatch");
    expect(checks("paywall-api", 0)).toMatch(/-> 402 payment already used/);
    expect(checks("paywall-api", 1)).toMatch(/^client refused/);
  });

  it("concepts.css carries the .nojs-only rules the chip/address output needs", () => {
    const css = readFileSync(
      path.join(realDocsRoot, "styles", "concepts.css"),
      "utf8",
    );
    expect(css).toMatch(/^\.nojs-only \{\n {2}display: none;/m);
    expect(css).toContain("html:not([data-theme-preference]) span.nojs-only");
  });

  it("rejects bad sources", () => {
    const problems: Problem[] = [];
    parseConcepts(
      {
        Bad: { name: "x" },
        ok: {
          name: "a",
          cat: "b",
          short: "<b>x</b>",
          href: "/x",
          extra: 1,
        },
      },
      "c",
      problems,
    );
    parsePaths(
      {
        p: {
          tab: "t",
          job: "j",
          name: "n",
          time: "1",
          intro: "x",
          steps: [["/a"]],
          first: 3,
        },
      },
      "p",
      problems,
    );
    parseAddresses(
      {
        "not-base58!": { label: "x" },
        "11111111111111111111111111111111": { label: "S", cluster: "moon" },
      },
      problems,
    );
    const msgs = problems.map((p) => p.message).join("\n");
    for (const m of [
      "kebab-case",
      "raw HTML",
      'unknown field "extra"',
      "root-relative",
      "[href, title]",
      "base58",
      "cluster must be",
    ])
      expect(msgs).toContain(m);
  });
});

describe("Open tutorial in Playground", () => {
  const def = (extra: Record<string, unknown> = {}) => ({
    q: {
      tab: "start",
      job: "j",
      name: "Quickstart",
      time: "~5 min",
      intro: "/developers/docs/q",
      steps: [["/developers/docs/q/a", "A"]],
      ...extra,
    },
  });
  const pg = {
    open: "packages/docs-examples/paths/start/q",
    kind: "anchor" as const,
  };

  it("is only in playground.mdx, never in the stepper", () => {
    const problems: Problem[] = [];
    const src = parsePaths(def(), "p", problems);
    expect(problems).toEqual([]);
    const p = src.paths[0]!;
    for (const n of [0, 1])
      expect(renderStepper(root, src, p, n)).not.toContain("sol-pg");
    const block = renderPlaygroundBlock(src, p, pg);
    expect(block).toContain(PATH_UI.playgroundNote);
    expect(block).toContain(
      '<a className="sol-pg-tut" data-pg-open="packages/docs-examples/paths/start/q">Open tutorial in Playground</a>',
    );
  });

  it("has no per-tutorial settings", () => {
    const problems: Problem[] = [];
    parsePaths(def({ playground: { stepper: false } }), "p", problems);
    expect(problems.map((p) => p.message).join("\n")).toContain(
      'unknown field "playground"',
    );
  });
});

describe("generated snippets", () => {
  it("never use JSX expression children (SSR dropped them at conversion time)", () => {
    const r = all();
    expect(errors(r.paths.problems)).toEqual([]);
    expect(errors(r.concepts.problems)).toEqual([]);
    for (const f of [...r.paths.written, ...r.concepts.written]) {
      if (!f.endsWith(".mdx")) continue;
      const full = read(f);
      expect(
        full.startsWith(
          "{/* GENERATED by packages/docs-tooling/src/generators/",
        ),
      ).toBe(true);
      const body = full.replace(/^\{\/\*.*\*\/\}\n/, "");
      // Inline code (recorded JSON in demo panels) is literal text.
      const withoutCode = body.replace(/`[^`\n]*`/g, "");
      expect(withoutCode, f).not.toMatch(/\{["[{]/);
    }
  });

  it("concept card, short text, backlinks and coverage", () => {
    all();
    const card = read("snippets/concepts/en/account.mdx");
    // A quiet glossary row: name and first sentence, the whole row a link.
    expect(card).toContain('<div className="sol-concept not-prose">');
    expect(card).toContain(
      '[<span className="sol-concept-name">Accounts</span> <span className="sol-concept-def">',
    );
    expect(card).toContain("](/developers/docs/core/accounts)");
    expect(card).not.toContain("Callout");
    expect(card).not.toContain("New concept");
    expect(card).not.toContain("Learn more");
    expect(read("snippets/concepts/en/mint.short.mdx")).toMatch(
      /\(\*mint authority\*\)/,
    );
    // wallet: card imported on step 1 (intro); clusters: chip (ref); rpc only in code.
    expect(read("snippets/concepts/en/wallet.used-in.mdx")).toContain(
      '[Payments <span className="sol-usedin-step">Step 1</span>](/developers/docs/payments/checkout/try-it)',
    );
    expect(read("snippets/concepts/en/clusters.used-in.mdx")).toContain(
      "/developers/docs/payments/checkout/try-it",
    );
    expect(read("snippets/concepts/en/rpc.used-in.mdx")).toContain(
      "Not used in a tutorial yet.",
    );
    const cov = read("snippets/concepts/en/coverage.mdx");
    expect(cov).toMatch(
      /Wallets & signatures\]\(\/developers\/docs\/core\/wallets\)<\/th><td data-cov="none">.*?<\/td><td data-cov="intro">\[Step 1\]/,
    );
    expect(cov).toMatch(
      /Devnet & mainnet\]\(\/developers\/docs\/references\/clusters\)<\/th><td data-cov="none">.*?<\/td><td data-cov="ref">mentioned/,
    );
    expect(cov).toMatch(
      /\[RPC\]\(\/developers\/docs\/rpc\) <span className="sol-cov-gap">not taught in a tutorial<\/span>/,
    );
  });

  it("stepper, next cards, path card", () => {
    all();
    const s2 = read("snippets/paths/en/checkout/stepper-2.mdx");
    expect(s2).toContain(
      'role="navigation" aria-label="Build a checkout · ~30 min"',
    );
    expect(s2).not.toContain("<nav");
    expect(s2).toMatch(
      /<li data-state="done"><a href="\/developers\/docs\/payments\/checkout\/try-it">/,
    );
    expect(s2).toMatch(
      /<li data-state="current"( data-first="true")?><a href="\/developers\/docs\/payments\/checkout\/browser" aria-current="step">/,
    );
    expect(s2.match(/aria-current/g)).toHaveLength(1);
    // Accessible name reads "Step 1, Done: Title", not "Step 1DoneTitle".
    expect(s2).toContain(
      'Step 1<span className="sol-vh">, </span><span className="sol-stepper-done">Done</span><span className="sol-vh">: </span></span>',
    );
    expect(read("snippets/paths/en/checkout/stepper-0.mdx")).not.toContain(
      "aria-current",
    );
    const card = read("snippets/paths/en/checkout/card.mdx");
    expect(card).toContain(
      "[Start the tutorial →](/developers/docs/payments/checkout)",
    );
    // Numbered steps, with no step singled out.
    expect(card).toMatch(
      /<li>\[[^\]]+\]\(\/developers\/docs\/payments\/checkout\/browser\)<\/li>/,
    );
    expect(card).not.toContain("First win");
    expect(read("styles/paths-sidebar.css")).not.toContain("::after");
  });

  it("demo: one server-rendered terminal panel with every recorded line", () => {
    const r = all();
    const demo = read("snippets/paths/en/checkout/demo.mdx");
    expect(demo).not.toContain("import ");
    expect(demo).toContain(
      '<div className="sol-term not-prose" data-term="paths/checkout/demo" data-kind="checkout" data-steps="2"',
    );
    // Recorded text is escaped (MDX/markdown), quotes go into inline code.
    expect(demo).toContain(
      '<div className="sol-term-row sol-term-ln"><span className="sol-term-k">Signature\\:</span> ```` 5h3f {x} <y> ``` ````</div>',
    );
    // Prompt and badges from pay.run.json.
    expect(demo).toContain("\\></span> await payStore(customer, order)</div>");
    expect(demo).toContain(
      '<span className="sol-term-badge" data-tone="ok">Confirmed</span>',
    );
    expect(demo).toContain('<div className="sol-term-success">');
    expect(demo).not.toMatch(
      /<details|<noscript|Replay|replay|\(ok\)|\(blocked\)|mismatch/,
    );
    // The refusal is a separate panel: no stage, no success message.
    const checks = read("snippets/paths/en/checkout/checks.mdx");
    expect(checks).toContain(
      '<div className="sol-term not-prose" data-term="paths/checkout/checks" data-kind="checkout" data-steps="1"',
    );
    expect(checks).toContain("amount mismatch");
    expect(checks).not.toMatch(/sol-term-success|sol-term-stage/);
    // No recordings for the other paths: no Run controls, warned.
    const paywall = read("snippets/paths/en/paywall-api/demo.mdx");
    expect(paywall).toContain(
      '<div data-norun="" className="sol-term not-prose"',
    );
    expect(paywall).toContain("Call the API without paying</strong>");
    expect(
      r.paths.problems.some(
        (p) => p.level === "warn" && p.message.includes("client.output.txt"),
      ),
    ).toBe(true);
  });
});

describe("--sync", () => {
  it("expands chips and addresses, leaves code alone, and is idempotent", () => {
    all();
    const out = read("docs/en/payments/checkout/try-it.mdx");
    expect(out).toContain(
      '<span className="sol-chip" data-concept="clusters"><Tooltip headline="Devnet & mainnet" tip="Devnet is a free public test network that behaves like the real one (mainnet), with play money. Same code, different URL." cta="Learn more" href="/developers/docs/references/clusters">devnet</Tooltip><span className="nojs-only"> ([Devnet & mainnet](/developers/docs/references/clusters): Devnet is a free public',
    );
    // Spec form <Tooltip data-concept> is wrapped; the trigger text is kept.
    expect(out).toContain(
      '<span className="sol-chip" data-concept="account"><Tooltip headline="Accounts"',
    );
    expect(out).toContain(">accounts</Tooltip>");
    expect(out).toContain(
      'cta="View on Solana Explorer" href="https://explorer.solana.com/address/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v">`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`</Tooltip><span className="nojs-only"> ([USDC mint (mainnet)]',
    );
    expect(out).toContain(
      'const usdc = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // <span data-concept="rpc">x</span>',
    );
    expect(
      out.startsWith(
        '---\ntitle: Pay as a customer\n---\n\nimport Stepper from "/snippets/paths/en/checkout/stepper-1.mdx";',
      ),
    ).toBe(true);
    const second = all();
    expect(second.concepts.synced).toEqual([]);
    expect(second.addresses.synced).toEqual([]);
    expect(second.concepts.written).toEqual([]);
    expect(read("docs/en/payments/checkout/try-it.mdx")).toBe(out);
    const check = all(true);
    expect([check.paths.ok, check.concepts.ok, check.addresses.ok]).toEqual([
      true,
      true,
      true,
    ]);
  });

  it("updates chip text when the source changes, and only marked elements", () => {
    all();
    const src = JSON.parse(read("concepts/concepts.en.json"));
    src.clusters.short = "Changed *text*.";
    write("concepts/concepts.en.json", JSON.stringify(src));
    const check = runConcepts({ docsRoot: root, check: true, sync: true });
    expect(check.ok).toBe(false);
    expect(check.synced).toContain("docs/en/payments/checkout/try-it.mdx");
    expect(check.written).toContain("snippets/concepts/en/clusters.mdx");
    runConcepts({ docsRoot: root, sync: true });
    const out = read("docs/en/payments/checkout/try-it.mdx");
    expect(out).toContain('tip="Changed text."');
    expect(out).toContain(": Changed text.)</span>");
  });

  it("locale pages: locale source + localized links when they exist, else English", () => {
    all();
    // No concepts.ja.json yet: English text, English snippet imports, but
    // links still go to the translated page when it exists.
    const before = read("docs/ja/payments/checkout/try-it.mdx");
    expect(before).toContain('"/snippets/concepts/en/wallet.mdx"');
    expect(before).toContain(
      'cta="Learn more" href="/ja/developers/docs/core/accounts"',
    );
    expect(before).toContain(
      "([Accounts](/ja/developers/docs/core/accounts): ",
    );
    write(
      "concepts/concepts.ja.json",
      JSON.stringify({
        account: { name: "アカウント" },
        _ui: { learnMore: "詳細" },
      }),
    );
    all();
    const ja = read("docs/ja/payments/checkout/try-it.mdx");
    expect(ja).toContain('"/snippets/concepts/ja/wallet.mdx"');
    expect(ja).toContain('headline="アカウント"');
    expect(ja).toContain('cta="詳細" href="/ja/developers/docs/core/accounts"');
    // Untranslated fields fall back to English; missing locale pages link to English.
    const card = read("snippets/concepts/ja/wallet.mdx");
    expect(card).toContain("A wallet holds a key pair");
    expect(card).toContain("](/developers/docs/core/wallets)");
    expect(read("snippets/concepts/ja/account.mdx")).toContain(
      "](/ja/developers/docs/core/accounts)",
    );
  });

  it("--check without --sync fails on stale chips and leaves pages alone", () => {
    all();
    const src = JSON.parse(read("concepts/concepts.en.json"));
    src.rent.short = "Changed.";
    src.clusters.short = "Changed too.";
    write("concepts/concepts.en.json", JSON.stringify(src));
    runConcepts({ docsRoot: root }); // regenerates snippets only
    const before = read("docs/en/payments/checkout/try-it.mdx");
    const check = runConcepts({ docsRoot: root, check: true });
    expect(check.written).toEqual([]);
    expect(check.synced).toEqual(["docs/en/payments/checkout/try-it.mdx"]);
    expect(check.ok).toBe(false);
    expect(read("docs/en/payments/checkout/try-it.mdx")).toBe(before);
    runConcepts({ docsRoot: root, sync: true });
    expect(runConcepts({ docsRoot: root, check: true }).ok).toBe(true);
  });

  it("paths --check fails when a locale page import needs re-pointing", () => {
    write("paths/paths.ja.json", JSON.stringify({ _ui: { step: "ステップ" } }));
    all();
    write(
      "docs/ja/payments/checkout/browser.mdx",
      page(
        "B",
        'import S from "/snippets/paths/en/checkout/stepper-2.mdx";\n\n<S />',
      ),
    );
    const check = runPaths({
      docsRoot: root,
      check: true,
      outputsRoot: outputs,
    });
    expect(check.synced).toEqual(["docs/ja/payments/checkout/browser.mdx"]);
    expect(check.ok).toBe(false);
  });

  it("address mentions use the locale layer on locale pages", () => {
    write(
      "addresses.ja.json",
      JSON.stringify({
        _ui: { cta: "エクスプローラーで見る" },
        EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: { label: "USDC ミント" },
      }),
    );
    write(
      "docs/ja/x.mdx",
      page(
        "X",
        'Mint <span className="sol-address" data-address="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v">`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`</span>.',
      ),
    );
    const r = runAddresses({ docsRoot: root, sync: true });
    expect(errors(r.problems)).toEqual([]);
    const ja = read("docs/ja/x.mdx");
    expect(ja).toContain('headline="USDC ミント"');
    expect(ja).toContain('cta="エクスプローラーで見る"');
    expect(ja).toContain("([USDC ミント](https://explorer.solana.com/address/");
    // English pages keep the English strings.
    expect(read("docs/en/payments/checkout/try-it.mdx")).toContain(
      'cta="View on Solana Explorer"',
    );
    write(
      "addresses.ja.json",
      JSON.stringify({
        So11111111111111111111111111111111111111113: { label: "x" },
      }),
    );
    expect(
      runAddresses({ docsRoot: root, check: true }).problems.some((p) =>
        p.message.includes("not in addresses.json"),
      ),
    ).toBe(true);
  });

  it("warns when a chip sits in a table cell (codec re-pads tables)", () => {
    write(
      "docs/en/t.mdx",
      page(
        "T",
        '| a | b |\n| - | - |\n| <span className="sol-chip" data-concept="rent">rent</span> | x |',
      ),
    );
    const r = runConcepts({ docsRoot: root, sync: true });
    expect(
      r.problems.some(
        (p) =>
          p.level === "warn" &&
          p.file === "docs/en/t.mdx" &&
          p.message.includes("table cell"),
      ),
    ).toBe(true);
  });

  it("reports unknown concepts and addresses", () => {
    write(
      "docs/en/x.mdx",
      page(
        "X",
        'A <span className="sol-chip" data-concept="nope">x</span> <span className="sol-address" data-address="So11111111111111111111111111111111111111113">y</span>',
      ),
    );
    const r = all();
    expect(
      r.concepts.problems.some((p) =>
        p.message.includes('unknown data-concept="nope"'),
      ),
    ).toBe(true);
    expect(
      r.addresses.problems.some((p) =>
        p.message.includes("is not in addresses.json"),
      ),
    ).toBe(true);
    expect(r.concepts.ok).toBe(false);
  });

  it("--report lists unmarked prose mentions only", () => {
    const r = runAddresses({ docsRoot: root, report: true });
    expect(r.candidates).toEqual([
      {
        file: "docs/en/payments/checkout/try-it.mdx",
        address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      },
    ]);
    expect(read("docs/en/payments/checkout/try-it.mdx")).toBe(TRY_IT);
  });
});

describe("generated folders", () => {
  it("removes orphans, refuses to delete hand-written files, --check reports drift", () => {
    all();
    write(
      "snippets/concepts/en/old.mdx",
      "{/* GENERATED by packages/docs-tooling/src/generators/concepts.ts */}\n",
    );
    write("snippets/concepts/en/mine.mdx", "hand written\n");
    const check = runConcepts({ docsRoot: root, check: true });
    expect(check.removed).toEqual(["snippets/concepts/en/old.mdx"]);
    expect(check.ok).toBe(false);
    expect(existsSync(path.join(root, "snippets/concepts/en/old.mdx"))).toBe(
      true,
    );
    runConcepts({ docsRoot: root });
    expect(existsSync(path.join(root, "snippets/concepts/en/old.mdx"))).toBe(
      false,
    );
    expect(read("snippets/concepts/en/mine.mdx")).toBe("hand written\n");
  });
});

describe("text helpers", () => {
  it("escape for MDX without expressions", () => {
    expect(mdText("a *b* {c} <d>")).toBe("a \\*b\\* \\{c\\} \\<d\\>");
    expect(attr("title", 'say "hi"')).toBe("title='say \"hi\"'");
    expect(plainText("A *b* **c** [d](/e) `f`")).toBe("A b c d f");
  });
});

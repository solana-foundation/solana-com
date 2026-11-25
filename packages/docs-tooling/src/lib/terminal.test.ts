import { describe, expect, it } from "vitest";
import { mdxCodec } from "./codec.ts";
import {
  DEFAULT_TERM_LABELS,
  lineTone,
  parseRunMeta,
  renderTerminal,
  shortB58,
  termInline,
} from "./terminal.ts";

const SIG =
  "3ECkpCBjPLbbpdYatLqyViQWUVt17LyYraz71AzPLHyf2JvX5SLeKzAdHjWoETNvzKfjJno65E7unHZbCg7NKSiT";

describe("terminal panel (src/lib/terminal.ts)", () => {
  it("shortens base58 values in the middle and keeps the full value", () => {
    expect(shortB58("F6kshv3peMz1DsAC1XthenbPcfaWdVnF49UU93T6JeUg")).toBe(
      "F6ks…JeUg",
    );
    const html = termInline(`Failed signature: ${SIG}`);
    expect(html).toContain(`title="${SIG}"`);
    expect(html).toContain(`<span className="sol-h-f">${SIG}</span>`);
    expect(html).toContain('aria-hidden="true">3ECk…KSiT</span>');
    expect(html).toContain('<span className="sol-term-k">signature\\:</span>');
  });

  it("escapes markdown and MDX syntax and protects quotes from smartypants", () => {
    expect(termInline('err: {"InstructionError":[0,{"Custom":17}]}')).toContain(
      '`{"InstructionError":[0,{"Custom":17}]}`',
    );
    const html = termInline("<x> *a* _b_ $1 & see: x@y");
    expect(html).toContain("\\<x\\>");
    expect(html).toContain("\\*a\\*");
    expect(html).toContain("\\$1");
    expect(html).toContain("see\\: x\\@y");
  });

  it("keeps URLs whole, as plain text that is never a link", () => {
    // The signature inside stays part of the URL (no base58 highlight), and
    // inline code keeps the docs from autolinking a Surfpool-only link.
    expect(
      termInline(
        `Explorer: https://explorer.solana.com/tx/${SIG}?cluster=devnet`,
      ),
    ).toBe(
      `<span className="sol-term-k">Explorer\\:</span> \`https://explorer.solana.com/tx/${SIG}?cluster=devnet\``,
    );
    // Trailing punctuation stays outside the URL.
    expect(
      termInline("Get SOL at https://faucet.solana.com, then run this again."),
    ).toBe("Get SOL at `https://faucet.solana.com`, then run this again.");
    expect(termInline("(see http://127.0.0.1:8899)")).toBe(
      "(see `http://127.0.0.1:8899`)",
    );
  });

  it("keeps a line with quotes in one code span, not one per token", () => {
    const html = termInline(
      'verifyPayment(order-1001, expects 2000000): {"paid":false,"reason":"amount mismatch: expected 2000000, received 1000000"}',
    );
    expect(html).toBe(
      '`verifyPayment(order-1001, expects 2000000): {"paid":false,"reason":"amount mismatch: expected 2000000, received 1000000"}`',
    );
    expect(
      termInline(
        "Permanent delegate moved 50 LSF out of the approved holder's account",
      ),
    ).toBe(
      "`Permanent delegate moved 50 LSF out of the approved holder's account`",
    );
    // A marked token still splits the line: the HTTP code, then one literal.
    expect(termInline('POST /x -> 402 {"paid":false}')).toBe(
      'POST /x -\\> <span className="sol-term-code" data-code="4xx">402</span> `{"paid":false}`',
    );
  });

  it("tones whole lines and HTTP codes", () => {
    expect(
      lineTone("Transfer 1 LSF to unapproved holder: failed onchain"),
    ).toBe("error");
    expect(lineTone('  err: {"InstructionError":[0,{"Custom":17}]}')).toBe(
      "error",
    );
    expect(
      lineTone("GET /api/forecast -> 402 X-PAYMENT header is required"),
    ).toBe("warn");
    expect(lineTone("Transfer 100 LSF to approved holder: confirmed")).toBe(
      "ok",
    );
    expect(lineTone("Transfer blocked: account is frozen")).toBe("error");
    expect(lineTone("Fee: 5000 lamports")).toBeUndefined();
    // What Node prints for verifyPayment()'s result.
    expect(lineTone("{ paid: true }")).toBe("ok");
    expect(lineTone("  paid: false,")).toBe("error");
    expect(termInline("GET / -> 200 ok")).toContain(
      '<span className="sol-term-code" data-code="2xx">200</span>',
    );
  });

  it("renders every line, prompts, badges and controls as parseable MDX", () => {
    const mdx = renderTerminal({
      id: "paths/x/demo",
      kind: "asset",
      title: "Demo",
      labels: DEFAULT_TERM_LABELS,
      stage: [
        {
          label: "Holder",
          states: [
            ["todo", "Not approved"],
            ["ok", "Approved"],
            ["error", "Rejected"],
          ],
        },
      ],
      success: "Done *well*.",
      steps: [
        {
          title: "One",
          description: "First `step`.",
          output: "a\n  b: c",
          meta: {
            commands: [{ at: 0, cmd: "await one()" }],
            badges: [{ tone: "ok", label: "Confirmed" }],
          },
        },
        { title: "Two", output: "$ python x.py\npaid: True" },
      ],
    });
    expect(mdx).toContain('data-steps="2"');
    expect(mdx).toContain('data-pending="call"');
    expect(mdx).toContain(
      '<span className="sol-term-ps" aria-hidden="true">\\></span> await one()',
    );
    expect(mdx).toContain(
      '<span className="sol-term-ps" aria-hidden="true">\\$</span> python x.py',
    );
    expect(mdx).toContain('data-indent="2"');
    expect(mdx).toContain('data-tone="ok">Confirmed</span>');
    expect(mdx).toContain('data-at="2" data-tone="error" data-final=""');
    expect(mdx).toContain('data-act="all"');
    // No JSX expression children (dropped by SSR at conversion time) and no
    // raw elements that renderer stripped.
    expect(mdx).not.toMatch(/>\{|<details|<noscript/);
    expect(() => mdxCodec.parse(mdx)).not.toThrow();
  });

  it("keeps the recorded text byte for byte (parsed back from the MDX)", () => {
    const output = [
      'POST /api/orders/o-1/confirm -> 402 {"paid":false,"reason":"already used"}',
      `  settled signature: ${SIG}`,
      "client refused: price 10000 is above maxAmount 5000; not paying",
      "a -- b ... it's `x` * _ $5 & www.example.com a@b.co",
    ].join("\n");
    const mdx = renderTerminal({
      id: "x",
      kind: "block",
      title: "T",
      labels: DEFAULT_TERM_LABELS,
      steps: [{ output }],
    });
    const { tree } = mdxCodec.parse(mdx);
    type N = {
      type: string;
      value?: string;
      name?: string;
      attributes?: { name: string; value: unknown }[];
      children?: N[];
    };
    const cls = (n: N) =>
      String(n.attributes?.find((a) => a.name === "className")?.value ?? "");
    const text = (n: N): string => {
      if (n.type === "text" || n.type === "inlineCode") return n.value ?? "";
      if (cls(n) === "sol-h-s") return "";
      return (n.children ?? []).map(text).join("");
    };
    const lines: string[] = [];
    const walk = (n: N) => {
      if (cls(n).includes("sol-term-ln")) {
        const indent = Number(
          n.attributes?.find((a) => a.name === "data-indent")?.value ?? 0,
        );
        lines.push(" ".repeat(indent) + text(n));
        return;
      }
      (n.children ?? []).forEach(walk);
    };
    walk(tree as unknown as N);
    expect(lines.join("\n")).toBe(output);
  });

  it("validates run.json", () => {
    const errors: string[] = [];
    const meta = parseRunMeta(
      {
        commands: [
          { at: 0, cmd: "x" },
          { at: -1, cmd: "y" },
        ],
        badges: [
          { tone: "ok", label: "A" },
          { tone: "nope", label: "B" },
        ],
        extra: 1,
      },
      errors,
      "w",
    );
    expect(meta?.commands).toEqual([{ at: 0, cmd: "x" }]);
    expect(meta?.badges).toEqual([{ tone: "ok", label: "A" }]);
    expect(errors.join("\n")).toContain('unknown field "extra"');
    expect(errors).toHaveLength(3);
  });
});

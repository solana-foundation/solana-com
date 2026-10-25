import { describe, expect, it, vi } from "vitest";
import type { IndexPage } from "@/lib/docs/llms-index";

const pages: IndexPage[] = [
  { url: "/developers/docs", title: "Start Here", description: "Begin." },
  { url: "/developers/docs/payments", title: "Payments" },
  {
    url: "/developers/docs/payments/x402",
    title: "x402",
    description: "Pay.",
  },
  { url: "/developers/docs/core", title: "Core" },
  { url: "/developers/cookbook/a", title: "Recipe" },
  { url: "/learn/what-is-solana", title: "What is Solana" },
];

vi.mock("@/lib/docs/llms", () => ({ indexPages: () => pages }));

const { GET, generateStaticParams } =
  await import("@/app/developers/docs/[section]/llms.txt/route");
const { renderLlmsTxt } = await import("@/lib/docs/llms-index");

const get = (section: string) =>
  GET(new Request(`http://localhost/developers/docs/${section}/llms.txt`), {
    params: Promise.resolve({ section }),
  });

describe("/llms.txt", () => {
  it("lists every page by section with .md links", () => {
    expect(renderLlmsTxt(pages, "# Header")).toBe(
      [
        "# Header",
        "",
        "## Core documentation",
        "",
        "- [Start Here](https://solana.com/developers/docs.md): Begin.",
        "- [Core](https://solana.com/developers/docs/core.md)",
        "- [Payments](https://solana.com/developers/docs/payments.md)",
        "- [x402](https://solana.com/developers/docs/payments/x402.md): Pay.",
        "",
        "## Cookbook",
        "",
        "- [Recipe](https://solana.com/developers/cookbook/a.md)",
        "",
        "## Learn",
        "",
        "- [What is Solana](https://solana.com/learn/what-is-solana.md)",
        "",
      ].join("\n"),
    );
  });
});

describe("/developers/docs/[section]/llms.txt", () => {
  it("prerenders one index per first-level docs section", () => {
    expect(generateStaticParams()).toEqual([
      { section: "core" },
      { section: "payments" },
    ]);
  });

  it("serves a section index with its routing note as plain text", async () => {
    const res = await get("payments");
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    const body = await res.text();
    expect(body.split("\n").slice(0, 3)).toEqual([
      "# Solana Documentation: Payments",
      "",
      "> Sending, accepting, and processing payments on Solana - subscriptions, batching, and agentic flows.",
    ]);
    expect(body).toContain(
      "- [x402](https://solana.com/developers/docs/payments/x402.md): Pay.",
    );
  });

  it("404s an unknown or malformed section", async () => {
    expect((await get("nope")).status).toBe(404);
    expect((await get("../llms")).status).toBe(404);
  });
});

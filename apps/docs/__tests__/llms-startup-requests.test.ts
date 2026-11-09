import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/docs/source", () => {
  const page = (url: string, title: string, body: string) => ({
    url,
    data: {
      title,
      description: `${title} documentation`,
      getText: async () => body,
    },
  });
  return {
    docsSource: {
      getPages: () => [
        page(
          "/developers/docs/core/accounts",
          "Accounts",
          "# Accounts\nExisting documentation content.",
        ),
        // No longer maintained: kept out of the agent indexes.
        page(
          "/developers/docs/tools/commerce-kit",
          "Commerce Kit",
          "Commerce Kit body.",
        ),
        page(
          "/developers/docs/tools/commerce-kit/quickstart/installation",
          "Installation",
          "Commerce Kit installation body.",
        ),
      ],
    },
    learnSource: { getPages: () => [] },
  };
});

import { GET as getIndex } from "../src/app/llms.txt/route";
import { GET as getFullIndex } from "../src/app/llms-full.txt/route";
import { GET as getDocsIndex } from "../src/app/developers/docs/llms.txt/route";
import { GET as getDocsFullIndex } from "../src/app/developers/docs/llms-full.txt/route";

const routes = [
  ["llms.txt", getIndex],
  ["llms-full.txt", getFullIndex],
  ["developers/docs/llms.txt", getDocsIndex],
  ["developers/docs/llms-full.txt", getDocsFullIndex],
] as const;

describe("public agent indexes", () => {
  it.each(routes)("serves startup discovery from /%s", async (_, get) => {
    const response = await get();
    const text = await response.text();

    expect(response.headers.get("Content-Type")).toContain("text/plain");
    expect(text).toContain("https://solana.com/request-for-startups.md");
    expect(text).toContain("request-for-startups.md#prediction-markets");
    expect(text).toContain("request-for-startups.md#ai-financial-advisor");
    expect(text).toContain("request-for-startups.md#startup-fundraising");
    expect(text.match(/request-for-startups\.md#/g)).toHaveLength(11);
    expect(text).toContain("https://solana.com/developers/docs/core/accounts");
  });

  it.each(routes)("leaves Commerce Kit out of /%s", async (_, get) => {
    const text = await (await get()).text();

    expect(text).not.toContain("/developers/docs/tools/commerce-kit");
    expect(text).not.toContain("Commerce Kit");
  });

  it("keeps the existing inline documentation in the full corpus", async () => {
    const response = await getFullIndex();
    expect(await response.text()).toContain("Existing documentation content.");
  });
});

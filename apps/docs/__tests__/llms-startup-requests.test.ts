import { describe, expect, it, vi } from "vitest";

vi.mock("@@/src/app/sources/docs", () => ({
  docsSource: {
    getPages: () => [
      {
        url: "/docs/core/accounts",
        data: {
          title: "Accounts",
          description: "Account documentation",
          getText: async () => "# Accounts\nExisting documentation content.",
        },
      },
    ],
  },
}));
vi.mock("@@/src/app/sources/cookbook", () => ({
  cookbookSource: { getPages: () => [] },
}));
vi.mock("@@/src/app/sources/learn", () => ({
  learnSource: { getPages: () => [] },
}));
vi.mock("@@/src/app/sources/developers-learn", () => ({
  developersLearnSource: { getPages: () => [] },
}));

import { GET as getIndex } from "../src/app/llms.txt/route";
import { GET as getFullIndex } from "../src/app/llms-full.txt/route";

describe("public agent indexes", () => {
  it.each([
    ["llms.txt", getIndex],
    ["llms-full.txt", getFullIndex],
  ] as const)("serves startup discovery from /%s", async (_, get) => {
    const response = await get();
    const text = await response.text();

    expect(response.headers.get("Content-Type")).toContain("text/plain");
    expect(text).toContain("https://solana.com/request-for-startups.md");
    expect(text).toContain("request-for-startups.md#prediction-markets");
    expect(text).toContain("request-for-startups.md#ai-financial-advisor");
    expect(text).toContain("request-for-startups.md#startup-fundraising");
    expect(text.match(/request-for-startups\.md#/g)).toHaveLength(11);
    expect(text).toContain("https://solana.com/docs/core/accounts");
  });

  it("keeps the existing inline documentation in the full corpus", async () => {
    const response = await getFullIndex();
    expect(await response.text()).toContain("Existing documentation content.");
  });
});

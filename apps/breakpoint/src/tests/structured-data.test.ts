import { describe, expect, it, vi } from "vitest";
import { buildBreakpointJsonLd, serializeJsonLd } from "@/lib/structured-data";

vi.mock("@workspace/i18n/server", async () => {
  const { default: messages } =
    await import("../../../../packages/i18n/messages/breakpoint/en/breakpoint.json");

  return {
    getTranslations:
      async ({ namespace }: { namespace: string }) =>
      (key: string) => {
        const path = `${namespace}.${key}`;
        let value: unknown = messages;

        for (const segment of path.split(".")) {
          if (!value || typeof value !== "object" || !(segment in value)) {
            throw new Error(`Missing translation: ${path}`);
          }
          value = (value as Record<string, unknown>)[segment];
        }

        if (typeof value !== "string") {
          throw new Error(`Expected text translation: ${path}`);
        }
        return value;
      },
  };
});

describe("serializeJsonLd", () => {
  it("escapes HTML-significant opening brackets", () => {
    expect(serializeJsonLd({ description: "</script><script>" })).toBe(
      '{"description":"\\u003c/script>\\u003cscript>"}',
    );
  });
});

describe("buildBreakpointJsonLd", () => {
  it("does not advertise expired offers or a missing FAQ in the post edition", async () => {
    const data = await buildBreakpointJsonLd("en", "post");
    const graph = data["@graph"] as Array<{
      "@type": string;
      offers?: unknown[];
    }>;
    expect(graph.find((node) => node["@type"] === "Event")?.offers).toEqual([]);
    expect(graph.some((node) => node["@type"] === "FAQPage")).toBe(false);
  });
  it("includes only the visible homepage FAQ questions", async () => {
    const { default: messages } =
      await import("../../../../packages/i18n/messages/breakpoint/en/breakpoint.json");
    const data = await buildBreakpointJsonLd("en", "pre");
    const graph = data["@graph"] as Array<{
      "@type": string;
      mainEntity?: Array<{ name: string; acceptedAnswer: { text: string } }>;
    }>;
    const faq = graph.find((node) => node["@type"] === "FAQPage");

    expect(faq?.mainEntity?.map((item) => item.name)).toEqual(
      Object.values(messages.breakpoint.faq.items).map((item) => item.question),
    );
    expect(faq?.mainEntity?.map((item) => item.acceptedAnswer.text)).toEqual(
      Object.values(messages.breakpoint.faq.items).map((item) => item.answer),
    );
  });
});

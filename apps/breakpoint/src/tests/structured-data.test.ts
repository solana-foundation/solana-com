import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "@/lib/structured-data";

describe("serializeJsonLd", () => {
  it("escapes HTML-significant opening brackets", () => {
    expect(serializeJsonLd({ description: "</script><script>" })).toBe(
      '{"description":"\\u003c/script>\\u003cscript>"}',
    );
  });
});

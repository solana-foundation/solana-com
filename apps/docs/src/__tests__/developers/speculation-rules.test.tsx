import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  DeveloperSpeculationRules,
  getDeveloperSpeculationRules,
} from "@/app/(docs)/[locale]/developers/speculation-rules";

describe("speculation rules on /developers", () => {
  it("prerenders docs links on hover and fetches nothing up front", () => {
    const rules = getDeveloperSpeculationRules("en");
    expect(rules).not.toHaveProperty("prefetch");
    expect(rules.prerender[0]).toMatchObject({
      source: "document",
      eagerness: "moderate",
    });
    expect(JSON.stringify(rules.prerender)).toContain(
      '"href_matches":"/developers/docs{/*}?"',
    );
  });

  it("localizes the URLs", () => {
    const rules = getDeveloperSpeculationRules("ja");
    expect(JSON.stringify(rules.prerender)).toContain(
      '"href_matches":"/ja/developers/docs{/*}?"',
    );
  });

  it("renders a raw speculationrules script in the server HTML", () => {
    const html = renderToString(<DeveloperSpeculationRules locale="en" />);
    expect(html).toMatch(/^<script type="speculationrules">\{.*\}<\/script>$/);
    const json = html.replace(/^<script[^>]*>|<\/script>$/g, "");
    expect(JSON.parse(json)).toEqual(getDeveloperSpeculationRules("en"));
  });
});

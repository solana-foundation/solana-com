import { describe, expect, it } from "vitest";

import {
  isThemeRoute,
  shouldShowDevelopersNav,
  shouldShowDocsSidebarToggle,
} from "../developer-routes";

describe("developer route matching", () => {
  it("shows the developer nav on exact or nested developer routes", () => {
    expect(shouldShowDevelopersNav("/developers")).toBe(true);
    expect(shouldShowDevelopersNav("/docs")).toBe(true);
    expect(shouldShowDevelopersNav("/data")).toBe(true);
    expect(shouldShowDevelopersNav("/data/cluster")).toBe(true);
    expect(shouldShowDevelopersNav("/de/data")).toBe(true);
  });

  it("does not show the developer nav on unrelated paths containing the same text", () => {
    expect(shouldShowDevelopersNav("/developership")).toBe(false);
    expect(shouldShowDevelopersNav("/metadata")).toBe(false);
    expect(shouldShowDevelopersNav("/news/data")).toBe(false);
  });

  it("keeps the docs sidebar toggle scoped to docs-owned routes", () => {
    expect(shouldShowDocsSidebarToggle("/docs")).toBe(true);
    expect(shouldShowDocsSidebarToggle("/fr/docs/rpc")).toBe(true);
    expect(shouldShowDocsSidebarToggle("/developers/cookbook")).toBe(true);
    expect(shouldShowDocsSidebarToggle("/data")).toBe(false);
  });

  it("keeps theme support on docs developer routes and data", () => {
    expect(isThemeRoute("/docs/rpc")).toBe(true);
    expect(isThemeRoute("/developers/guides/getting-started")).toBe(true);
    expect(isThemeRoute("/data")).toBe(true);
    expect(isThemeRoute("/database")).toBe(false);
  });
});

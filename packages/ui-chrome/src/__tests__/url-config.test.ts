import { afterEach, describe, expect, it, vi } from "vitest";

const originalAppName = process.env.NEXT_PUBLIC_APP_NAME;

async function loadShouldUseNextLink(appName?: string) {
  vi.resetModules();

  if (appName) {
    process.env.NEXT_PUBLIC_APP_NAME = appName;
  } else {
    delete process.env.NEXT_PUBLIC_APP_NAME;
  }

  return (await import("../url-config")).shouldUseNextLink;
}

afterEach(() => {
  vi.resetModules();

  if (originalAppName) {
    process.env.NEXT_PUBLIC_APP_NAME = originalAppName;
  } else {
    delete process.env.NEXT_PUBLIC_APP_NAME;
  }
});

describe("cross-app URL configuration", () => {
  it("treats /data as an internal web route", async () => {
    const shouldUseNextLink = await loadShouldUseNextLink();

    expect(shouldUseNextLink("/data")).toBe(true);
    expect(shouldUseNextLink("/data/cluster")).toBe(true);
  });

  it("does not treat /data as an internal docs route", async () => {
    const shouldUseNextLink = await loadShouldUseNextLink("docs");

    expect(shouldUseNextLink("/docs")).toBe(true);
    expect(shouldUseNextLink("/developers/cookbook")).toBe(true);
    expect(shouldUseNextLink("/data")).toBe(false);
  });

  it("keeps cross-app and external routes on regular anchors", async () => {
    const shouldUseNextLink = await loadShouldUseNextLink();

    expect(shouldUseNextLink("/docs")).toBe(false);
    expect(shouldUseNextLink("/developers/templates")).toBe(false);
    expect(shouldUseNextLink("https://solana.com/data")).toBe(false);
    expect(shouldUseNextLink("//solana.com/data")).toBe(false);
  });
});

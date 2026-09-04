import { afterEach, describe, expect, it, vi } from "vitest";

import { SITE_URL } from "../constants";
import { templatesRoutes } from "../routes/templates";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("templatesRoutes", () => {
  it("always emits the templates index route", async () => {
    const entries = await templatesRoutes(async () => []);

    expect(entries).toEqual([
      {
        url: `${SITE_URL}/developers/templates`,
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ]);
  });

  it("emits one route per template", async () => {
    const entries = await templatesRoutes(async () => [
      { name: "gill" },
      { name: "next-tailwind" },
    ]);

    expect(entries.map((entry) => entry.url)).toEqual([
      `${SITE_URL}/developers/templates`,
      `${SITE_URL}/developers/templates/gill`,
      `${SITE_URL}/developers/templates/next-tailwind`,
    ]);
  });

  it("percent-encodes template names so urls stay valid", async () => {
    const entries = await templatesRoutes(async () => [
      { name: "anchor counter" },
    ]);

    expect(entries[1]?.url).toBe(
      `${SITE_URL}/developers/templates/anchor%20counter`,
    );
  });

  it("returns an empty sitemap instead of failing the build when the fetch throws", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(
      templatesRoutes(async () => {
        throw new Error("templates request failed with 500");
      }),
    ).resolves.toEqual([]);

    expect(consoleError).toHaveBeenCalledOnce();
  });
});

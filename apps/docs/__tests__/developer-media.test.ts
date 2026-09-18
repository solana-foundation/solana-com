import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

afterEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("developer media feed", () => {
  it("uses the related Media preview deployment when available", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("NEXT_PUBLIC_MEDIA_APP_URL", "");
    vi.stubEnv(
      "VERCEL_RELATED_PROJECTS",
      JSON.stringify([
        {
          project: { name: "solana-com-media" },
          preview: {
            branch: "solana-com-media-git-feature-solana-foundation.vercel.app",
          },
          production: {},
        },
      ]),
    );

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ updates: [] }), {
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { getLatestDeveloperUpdates } = await import("@/lib/developer-media");

    await getLatestDeveloperUpdates();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://solana-com-media-git-feature-solana-foundation.vercel.app/api/developer-updates/latest",
      {
        headers: { accept: "application/json" },
        next: { revalidate: 300 },
      },
    );
  });
});

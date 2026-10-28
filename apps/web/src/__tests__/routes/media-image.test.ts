import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("../../../apps-urls", () => ({
  MEDIA_APP_URL: "https://media-preview.vercel.app",
}));

import { GET } from "@/app/api/media/image/route";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

const request = (path: string) =>
  new NextRequest(
    `https://solana.com/api/media/image?${new URLSearchParams({ path })}`,
  );
const image = () =>
  new Response(new Uint8Array([1, 2, 3]), {
    headers: { "Content-Type": "image/webp" },
  });

describe("Media image proxy", () => {
  it.each([200, 401])(
    "retries public uploads when the Media preview returns an HTML login page (%s)",
    async (status) => {
      vi.stubEnv("NODE_ENV", "production");
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(
          new Response("Login", {
            status,
            headers: { "Content-Type": "text/html" },
          }),
        )
        .mockResolvedValueOnce(image());
      vi.stubGlobal("fetch", fetchMock);

      const response = await GET(
        request("/media-assets/uploads/posts/story/hero.webp"),
      );
      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("image/webp");
      expect([...new Uint8Array(await response.arrayBuffer())]).toEqual([
        1, 2, 3,
      ]);
      expect(fetchMock).toHaveBeenLastCalledWith(
        new URL(
          "https://solana-com-media.vercel.app/uploads/posts/story/hero.webp",
        ),
        { next: { revalidate: 300 } },
      );
    },
  );

  it("uses an available preview image without a second request", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const fetchMock = vi.fn().mockResolvedValue(image());
    vi.stubGlobal("fetch", fetchMock);
    expect((await GET(request("/uploads/story.webp"))).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not return or cache HTML as a successful image", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockImplementation(
          async () =>
            new Response("Login", { headers: { "Content-Type": "text/html" } }),
        ),
    );
    const response = await GET(request("/uploads/story.webp"));
    expect(response.status).toBe(502);
    expect(response.headers.get("Cache-Control")).toBeNull();
  });

  it.each([
    "/api/private",
    "/uploads/../api/private",
    "/uploads/%2e%2e/api/private",
  ])(
    "rejects non-upload and traversal paths before requesting Media (%s)",
    async (path) => {
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);
      expect((await GET(request(path))).status).toBe(400);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
  it("preserves image queries across a public retry", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response("Login", { headers: { "Content-Type": "text/html" } }),
      )
      .mockResolvedValueOnce(image());
    vi.stubGlobal("fetch", fetchMock);
    const response = await GET(
      request("/media-assets/uploads/story.webp?width=640&fit=cover"),
    );
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      new URL(
        "https://media-preview.vercel.app/uploads/story.webp?width=640&fit=cover",
      ),
      { next: { revalidate: 300 } },
    );
    expect(fetchMock).toHaveBeenLastCalledWith(
      new URL(
        "https://solana-com-media.vercel.app/uploads/story.webp?width=640&fit=cover",
      ),
      { next: { revalidate: 300 } },
    );
  });
});

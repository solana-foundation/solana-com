import { describe, expect, it } from "vitest";
import {
  ACCELERATE_APP_URL,
  BREAKPOINT_APP_URL,
  DOCS_APP_URL,
  MEDIA_APP_URL,
  TEMPLATES_APP_URL,
} from "@@/apps-urls";
import rewritesAndRedirects from "@@/rewrites-redirects";

const beforeFiles = rewritesAndRedirects.rewrites.beforeFiles;

function expectBeforeFileRewrite(
  source: string,
  destination: string,
  extra?: Record<string, unknown>,
) {
  expect(beforeFiles).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        source,
        destination,
        locale: false,
        ...extra,
      }),
    ]),
  );
}

function sourceIndex(source: string) {
  return beforeFiles.findIndex((rewrite) => rewrite.source === source);
}

describe("Cross-app rewrites", () => {
  it("proxies app-owned route namespaces to their owning deployments", () => {
    expectBeforeFileRewrite("/news", `${MEDIA_APP_URL}/news`);
    expectBeforeFileRewrite(
      "/podcasts/:path*",
      `${MEDIA_APP_URL}/podcasts/:path*`,
    );
    expectBeforeFileRewrite("/docs/:path*", `${DOCS_APP_URL}/docs/:path*`);
    expectBeforeFileRewrite(
      "/developers/cookbook/:path*",
      `${DOCS_APP_URL}/developers/cookbook/:path*`,
    );
    expectBeforeFileRewrite(
      "/developers/templates/:path*",
      `${TEMPLATES_APP_URL}/developers/templates/:path*`,
    );
    expectBeforeFileRewrite(
      "/accelerate/:path*",
      `${ACCELERATE_APP_URL}/accelerate/:path*`,
    );
    expectBeforeFileRewrite(
      "/breakpoint/:path*",
      `${BREAKPOINT_APP_URL}/breakpoint/:path*`,
    );
  });

  it("keeps templates rewrites before generic developer docs rewrites", () => {
    expect(sourceIndex("/developers/templates")).toBeLessThan(
      sourceIndex("/developers"),
    );
    expect(sourceIndex("/developers/templates/:path*")).toBeLessThan(
      sourceIndex("/developers/:path*.md"),
    );
    expect(sourceIndex("/developers/templates/:path*")).toBeLessThan(
      sourceIndex("/developers/cookbook/:path*"),
    );
  });

  it("proxies deployed app asset prefixes through the main site", () => {
    expectBeforeFileRewrite(
      "/breakpoint-assets/:path+",
      `${BREAKPOINT_APP_URL}/breakpoint-assets/:path+`,
    );
    expectBeforeFileRewrite(
      "/media-assets/:path+",
      `${MEDIA_APP_URL}/media-assets/:path+`,
    );
    expectBeforeFileRewrite(
      "/templates-assets/:path+",
      `${TEMPLATES_APP_URL}/templates-assets/:path+`,
    );
    expectBeforeFileRewrite(
      "/accelerate-assets/_next/:path+",
      `${ACCELERATE_APP_URL}/_next/:path+`,
    );
    expectBeforeFileRewrite(
      "/docs-assets/:path+",
      `${DOCS_APP_URL}/docs-assets/:path+`,
    );
  });

  it("proxies media upload images to the media app image optimizer", () => {
    expectBeforeFileRewrite(
      "/_next/image",
      `${MEDIA_APP_URL}/media-assets/_next/image`,
      {
        has: [{ type: "query", key: "url", value: "/uploads/(.*)" }],
      },
    );
    expectBeforeFileRewrite(
      "/uploads/:path+",
      `${MEDIA_APP_URL}/media-assets/uploads/:path+`,
    );
  });
});

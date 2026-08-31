import { describe, expect, it } from "vitest";
import {
  APP_TOPOLOGY,
  createSecretsRolloutManifest,
} from "@workspace/app-topology";

describe("app topology manifest", () => {
  it("captures the existing app identities and deployment topology", () => {
    expect(APP_TOPOLOGY).toMatchObject({
      web: {
        appName: "web",
        packageName: "solana-com",
        workspace: "apps/web",
        port: 3000,
        assetPrefix: null,
        vercel: {
          projectName: "solana-com",
          defaultHost: "https://solana-com-solana-foundation.vercel.app",
        },
      },
      templates: {
        appName: "templates",
        packageName: "solana-templates",
        workspace: "apps/templates",
        port: 3001,
        assetPrefix: "/templates-assets",
        appUrlEnvironmentVariable: "NEXT_PUBLIC_TEMPLATES_APP_URL",
        vercel: {
          projectName: "templates",
          defaultHost: "https://solana-templates.vercel.app",
        },
      },
      media: {
        appName: "media",
        packageName: "solana-com-media",
        workspace: "apps/media",
        port: 3002,
        assetPrefix: "/media-assets",
        appUrlEnvironmentVariable: "NEXT_PUBLIC_MEDIA_APP_URL",
        vercel: {
          projectName: "solana-com-media",
          defaultHost: "https://solana-com-media.vercel.app",
        },
      },
      docs: {
        appName: "docs",
        packageName: "solana-docs",
        workspace: "apps/docs",
        port: 3003,
        assetPrefix: "/docs-assets",
        appUrlEnvironmentVariable: "NEXT_PUBLIC_DOCS_APP_URL",
        vercel: {
          projectName: "solana-com-docs",
          defaultHost: "https://solana-com-docs.vercel.app",
        },
      },
      accelerate: {
        appName: "accelerate",
        packageName: "solana-com-accelerate",
        workspace: "apps/accelerate",
        port: 3004,
        assetPrefix: "/accelerate-assets",
        appUrlEnvironmentVariable: "NEXT_PUBLIC_ACCELERATE_APP_URL",
        vercel: {
          projectName: "solana-com-accelerate",
          defaultHost: "https://solana-com-accelerate.vercel.app",
        },
      },
      breakpoint: {
        appName: "breakpoint",
        packageName: "solana-com-breakpoint",
        workspace: "apps/breakpoint",
        port: 3005,
        assetPrefix: "/breakpoint-assets",
        appUrlEnvironmentVariable: "NEXT_PUBLIC_BREAKPOINT_APP_URL",
        vercel: {
          projectName: "solana-com-breakpoint-2",
          defaultHost: "https://solana-com-breakpoint-2.vercel.app",
        },
      },
    });
  });

  it("generates the existing secrets-rollout deployment manifest", () => {
    expect(createSecretsRolloutManifest()).toEqual({
      vercel_scope: "solana-foundation",
      projects: [
        {
          doppler_project: "solana-com",
          doppler_config: "production",
          vercel_project: "solana-com",
          vercel_scope: "solana-foundation",
          smoke_urls: [
            "https://solana.com/",
            "https://solana-com-solana-foundation.vercel.app",
          ],
        },
        {
          doppler_project: "solana-com-docs",
          doppler_config: "production",
          vercel_project: "solana-com-docs",
          vercel_scope: "solana-foundation",
          smoke_urls: [
            "https://solana.com/docs",
            "https://solana-com-docs.vercel.app",
          ],
        },
        {
          doppler_project: "solana-com-media",
          doppler_config: "production",
          vercel_project: "solana-com-media",
          vercel_scope: "solana-foundation",
          smoke_urls: [
            "https://solana.com/news",
            "https://solana-com-media.vercel.app",
          ],
        },
        {
          doppler_project: "templates",
          doppler_config: "production",
          vercel_project: "templates",
          vercel_scope: "solana-foundation",
          smoke_urls: [
            "https://solana.com/developers/templates",
            "https://solana-templates.vercel.app",
          ],
        },
        {
          doppler_project: "solana-com-accelerate",
          doppler_config: "production",
          vercel_project: "solana-com-accelerate",
          vercel_scope: "solana-foundation",
          smoke_urls: [
            "https://solana.com/accelerate",
            "https://solana-com-accelerate.vercel.app",
          ],
        },
        {
          doppler_project: "solana-com-breakpoint-2",
          doppler_config: "production",
          vercel_project: "solana-com-breakpoint-2",
          vercel_scope: "solana-foundation",
          smoke_urls: [
            "https://solana.com/breakpoint",
            "https://solana-com-breakpoint-2.vercel.app",
          ],
        },
      ],
    });
  });
});

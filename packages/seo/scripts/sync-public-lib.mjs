import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import pngToIco from "png-to-ico";

export const generatedFiles = [
  "favicon.svg",
  "favicon.png",
  "favicon.ico",
  "apple-touch-icon.png",
  "icon-192.png",
  "icon-512.png",
];

export const appConfigs = [
  {
    app: "web",
    publicDir: "apps/web/public",
    manifest: {
      name: "Solana",
      short_name: "Solana",
      theme_color: "#fff",
      background_color: "#fff",
      display: "standalone",
    },
  },
  {
    app: "docs",
    publicDir: "apps/docs/public",
    manifest: {
      name: "Solana",
      short_name: "Solana",
      theme_color: "#fff",
      background_color: "#fff",
      display: "standalone",
    },
  },
  {
    app: "breakpoint",
    publicDir: "apps/breakpoint/public",
    manifest: {
      name: "Breakpoint 2026",
      short_name: "Breakpoint",
      theme_color: "#11081b",
      background_color: "#11081b",
      display: "standalone",
    },
  },
  {
    app: "media",
    publicDir: "apps/media/public",
    manifest: {
      name: "Solana Media",
      short_name: "Media",
      theme_color: "#14F195",
      background_color: "#000000",
      display: "standalone",
    },
  },
  {
    app: "accelerate",
    publicDir: "apps/accelerate/public",
    manifest: {
      name: "Solana Accelerate 2026",
      short_name: "Accelerate",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
    },
  },
];

export function buildManifest({
  name,
  short_name,
  theme_color,
  background_color,
  display,
}) {
  return {
    name,
    short_name,
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color,
    background_color,
    display,
  };
}

function renderPng(svg, size) {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: size,
    },
  });

  return resvg.render().asPng();
}

export async function generateIconFiles({ assetsDir }) {
  const svg = readFileSync(resolve(assetsDir, "favicon.svg"));

  return {
    "favicon.svg": svg,
    "favicon.png": renderPng(svg, 96),
    "favicon.ico": await pngToIco([
      renderPng(svg, 16),
      renderPng(svg, 32),
      renderPng(svg, 48),
    ]),
    "apple-touch-icon.png": renderPng(svg, 180),
    "icon-192.png": renderPng(svg, 192),
    "icon-512.png": renderPng(svg, 512),
  };
}

export async function syncPublicAssets({ repoRoot, assetsDir, appFilter }) {
  const selectedApps = appFilter
    ? appConfigs.filter((app) => app.app === appFilter)
    : appConfigs;

  if (appFilter && selectedApps.length === 0) {
    throw new Error(`Unknown app '${appFilter}'`);
  }

  const iconFiles = await generateIconFiles({ assetsDir });

  for (const app of selectedApps) {
    const publicDir = resolve(repoRoot, app.publicDir);
    mkdirSync(publicDir, { recursive: true });

    for (const filename of generatedFiles) {
      writeFileSync(resolve(publicDir, filename), iconFiles[filename]);
    }

    writeFileSync(
      resolve(publicDir, "site.webmanifest"),
      `${JSON.stringify(buildManifest(app.manifest), null, 2)}\n`,
    );
  }
}

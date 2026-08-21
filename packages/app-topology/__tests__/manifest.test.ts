import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  APP_NAMES,
  APP_TOPOLOGY,
  PROXY_APP_NAMES,
  createCrossAppRewrites,
  createSecretsRolloutManifest,
  getNextPublicAppEnv,
} from "../src/index.ts";

describe("app topology", () => {
  it("has unique app identities, ports, asset prefixes, URL env vars, and Vercel projects", () => {
    const unique = <T>(values: T[]) => new Set(values).size === values.length;
    const apps = APP_NAMES.map((appName) => APP_TOPOLOGY[appName]);

    expect(unique(apps.map((app) => app.packageName))).toBe(true);
    expect(unique(apps.map((app) => app.workspace))).toBe(true);
    expect(unique(apps.map((app) => app.port))).toBe(true);
    expect(unique(apps.flatMap((app) => app.assetPrefix ?? []))).toBe(true);
    expect(
      unique(apps.flatMap((app) => app.appUrlEnvironmentVariable ?? [])),
    ).toBe(true);
    expect(unique(apps.map((app) => app.vercel.projectName))).toBe(true);
  });

  it("generates the embedded app-name environment variable", () => {
    for (const appName of PROXY_APP_NAMES) {
      expect(getNextPublicAppEnv(appName)).toEqual({
        NEXT_PUBLIC_APP_NAME: appName,
      });
    }
  });

  it("keeps specific cross-app routes before overlapping generic routes", () => {
    const appUrls = Object.fromEntries(
      PROXY_APP_NAMES.map((appName) => [appName, `https://${appName}.test`]),
    ) as Record<(typeof PROXY_APP_NAMES)[number], string>;
    const rewrites = createCrossAppRewrites(appUrls);
    const indexOf = (source: string) =>
      rewrites.findIndex((rewrite) => rewrite.source === source);

    expect(indexOf("/developers/templates/:path*")).toBeLessThan(
      indexOf("/developers/:path*.md"),
    );
    expect(indexOf("/accelerate-assets/_next/:path+")).toBeLessThan(
      indexOf("/accelerate-assets/:path+"),
    );
    expect(indexOf("/media-assets/uploads/:path+")).toBeLessThan(
      indexOf("/media-assets/:path+"),
    );
  });

  it("keeps package dev commands aligned with manifest ports", async () => {
    for (const appName of APP_NAMES) {
      const app = APP_TOPOLOGY[appName];
      const packageJsonPath = fileURLToPath(
        new URL(`../../../${app.workspace}/package.json`, import.meta.url),
      );
      const packageJson = JSON.parse(
        await readFile(packageJsonPath, "utf8"),
      ) as {
        scripts: { dev: string };
      };

      if (appName === "web") {
        expect(packageJson.scripts.dev).toBe("next dev");
      } else {
        expect(packageJson.scripts.dev).toMatch(
          new RegExp(`next dev (?:--port|-p) ${app.port}$`),
        );
      }
    }
  });

  it("keeps the rollout workflow choices aligned with Vercel project names", async () => {
    const workflowPath = fileURLToPath(
      new URL(
        "../../../.github/workflows/secrets-rollout.yml",
        import.meta.url,
      ),
    );
    const workflow = await readFile(workflowPath, "utf8");
    const optionsBlock = workflow.match(
      /options:\n(?<options>(?:\s+- [^\n]+\n)+)\s+repository_dispatch:/,
    )?.groups?.options;
    const workflowProjects = [
      ...(optionsBlock?.matchAll(/- ([^\s]+)/g) ?? []),
    ].map((match) => match[1]);
    const manifestProjects = createSecretsRolloutManifest().projects.map(
      (project) => project.vercel_project,
    );

    expect(workflowProjects).toEqual(manifestProjects);
  });

  it("keeps declared topology environment variables aligned with consumers", async () => {
    const rootUrl = new URL("../../../", import.meta.url);
    const turbo = JSON.parse(
      await readFile(new URL("turbo.json", rootUrl), "utf8"),
    ) as { globalEnv: string[] };
    const exampleEnvironment = await readFile(
      new URL("apps/web/.env.example", rootUrl),
      "utf8",
    );
    const publicAppUrlEnvironmentVariables = PROXY_APP_NAMES.map(
      (appName) => APP_TOPOLOGY[appName].appUrlEnvironmentVariable,
    );
    const topologyEnvironmentVariables = [
      ...publicAppUrlEnvironmentVariables,
      ...PROXY_APP_NAMES.flatMap(
        (appName) => APP_TOPOLOGY[appName].appUrlEnvironmentVariableAliases,
      ),
      "NEXT_PUBLIC_APP_NAME",
    ];

    expect(turbo.globalEnv).toEqual(
      expect.arrayContaining(topologyEnvironmentVariables),
    );
    for (const environmentVariable of publicAppUrlEnvironmentVariables) {
      expect(exampleEnvironment).toContain(`${environmentVariable}=`);
    }
  });
});

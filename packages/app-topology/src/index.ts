export const APP_NAME_ENVIRONMENT_VARIABLE = "NEXT_PUBLIC_APP_NAME" as const;
export const VERCEL_SCOPE = "solana-foundation" as const;

type AppNameEnvironmentVariable = typeof APP_NAME_ENVIRONMENT_VARIABLE | null;
type AppUrlEnvironmentVariable = `NEXT_PUBLIC_${Uppercase<string>}_APP_URL`;
type RouteMatch = "exact" | "prefix" | "descendants";
type RouteWildcard = "path*" | "path+";

export type AppName =
  | "web"
  | "docs"
  | "media"
  | "templates"
  | "accelerate"
  | "breakpoint";
export type ProxyAppName = Exclude<AppName, "web">;

export interface AppRoute {
  path: `/${string}`;
  match: RouteMatch;
  destination?: `/${string}`;
  localized?: boolean;
  markdown?: "children" | "base-and-children";
  navigation?: boolean;
  webMiddleware?: boolean;
  wildcard?: RouteWildcard;
}

export interface AssetProxyRoute {
  source: `/${string}`;
  destination: `/${string}`;
  has?: ReadonlyArray<{
    type: "query";
    key: string;
    value: string;
  }>;
}

export interface AppTopologyEntry {
  appName: AppName;
  packageName: string;
  workspace: `apps/${string}`;
  port: number;
  assetPrefix: `/${string}` | null;
  appNameEnvironmentVariable: AppNameEnvironmentVariable;
  appUrlEnvironmentVariable: AppUrlEnvironmentVariable | null;
  appUrlEnvironmentVariableAliases: readonly string[];
  routes: readonly AppRoute[];
  assetProxyRoutes: readonly AssetProxyRoute[];
  webMiddlewareAssetPrefix: boolean;
  vercel: {
    projectName: string;
    defaultHost: `https://${string}`;
    scope: typeof VERCEL_SCOPE;
  };
  secretsRollout: {
    dopplerProject: string;
    dopplerConfig: "production";
    smokeUrls: readonly [`https://${string}`, `https://${string}`];
  };
}

const apps = {
  web: {
    appName: "web",
    packageName: "solana-com",
    workspace: "apps/web",
    port: 3000,
    assetPrefix: null,
    appNameEnvironmentVariable: null,
    appUrlEnvironmentVariable: null,
    appUrlEnvironmentVariableAliases: [],
    routes: [],
    assetProxyRoutes: [],
    webMiddlewareAssetPrefix: false,
    vercel: {
      projectName: "solana-com",
      defaultHost: "https://solana-com-solana-foundation.vercel.app",
      scope: VERCEL_SCOPE,
    },
    secretsRollout: {
      dopplerProject: "solana-com",
      dopplerConfig: "production",
      smokeUrls: [
        "https://solana.com/",
        "https://solana-com-solana-foundation.vercel.app",
      ],
    },
  },
  docs: {
    appName: "docs",
    packageName: "solana-docs",
    workspace: "apps/docs",
    port: 3003,
    assetPrefix: "/docs-assets",
    appNameEnvironmentVariable: APP_NAME_ENVIRONMENT_VARIABLE,
    appUrlEnvironmentVariable: "NEXT_PUBLIC_DOCS_APP_URL",
    appUrlEnvironmentVariableAliases: [],
    routes: [
      {
        path: "/opengraph",
        match: "descendants",
        wildcard: "path+",
        webMiddleware: true,
      },
      { path: "/llms.txt", match: "exact" },
      { path: "/llms-full.txt", match: "exact" },
      {
        path: "/docs",
        match: "prefix",
        localized: true,
        markdown: "base-and-children",
        navigation: true,
        webMiddleware: true,
      },
      {
        path: "/learn",
        match: "prefix",
        localized: true,
        markdown: "children",
        navigation: true,
        webMiddleware: true,
      },
      {
        path: "/developers",
        match: "exact",
        localized: true,
        markdown: "children",
        navigation: true,
        webMiddleware: true,
      },
      {
        path: "/developers/cookbook",
        match: "prefix",
        localized: true,
        navigation: true,
        webMiddleware: true,
      },
      {
        path: "/developers/guides",
        match: "prefix",
        localized: true,
      },
      {
        path: "/developers/bootcamp",
        match: "prefix",
        localized: true,
        navigation: true,
        webMiddleware: true,
      },
    ],
    assetProxyRoutes: [
      {
        source: "/docs-assets/:path+",
        destination: "/docs-assets/:path+",
      },
    ],
    webMiddlewareAssetPrefix: true,
    vercel: {
      projectName: "solana-com-docs",
      defaultHost: "https://solana-com-docs.vercel.app",
      scope: VERCEL_SCOPE,
    },
    secretsRollout: {
      dopplerProject: "solana-com-docs",
      dopplerConfig: "production",
      smokeUrls: [
        "https://solana.com/docs",
        "https://solana-com-docs.vercel.app",
      ],
    },
  },
  media: {
    appName: "media",
    packageName: "solana-com-media",
    workspace: "apps/media",
    port: 3002,
    assetPrefix: "/media-assets",
    appNameEnvironmentVariable: APP_NAME_ENVIRONMENT_VARIABLE,
    appUrlEnvironmentVariable: "NEXT_PUBLIC_MEDIA_APP_URL",
    appUrlEnvironmentVariableAliases: ["MEDIA_APP_URL"],
    routes: [
      { path: "/admin", match: "exact" },
      {
        path: "/news",
        match: "prefix",
        localized: true,
        navigation: true,
        webMiddleware: true,
      },
      {
        path: "/changelog",
        match: "prefix",
        localized: true,
        navigation: true,
        webMiddleware: true,
      },
      {
        path: "/reports",
        match: "prefix",
        localized: true,
        webMiddleware: true,
      },
      {
        path: "/podcasts",
        match: "prefix",
        localized: true,
        navigation: true,
        webMiddleware: true,
      },
      {
        path: "/upgrade",
        match: "exact",
        destination: "/upgrades",
        localized: true,
        webMiddleware: true,
      },
      {
        path: "/upgrades",
        match: "prefix",
        localized: true,
        wildcard: "path+",
        webMiddleware: true,
      },
      { path: "/api/posts", match: "descendants" },
      { path: "/api/reports", match: "descendants" },
      { path: "/api/links", match: "descendants" },
    ],
    assetProxyRoutes: [
      {
        source: "/_next/image",
        destination: "/media-assets/_next/image",
        has: [{ type: "query", key: "url", value: "/uploads/(.*)" }],
      },
      {
        source: "/media-assets/uploads/:path+",
        destination: "/media-assets/uploads/:path+",
      },
      {
        source: "/media-assets/:path+",
        destination: "/media-assets/:path+",
      },
      {
        source: "/uploads/:path+",
        destination: "/media-assets/uploads/:path+",
      },
    ],
    webMiddlewareAssetPrefix: true,
    vercel: {
      projectName: "solana-com-media",
      defaultHost: "https://solana-com-media.vercel.app",
      scope: VERCEL_SCOPE,
    },
    secretsRollout: {
      dopplerProject: "solana-com-media",
      dopplerConfig: "production",
      smokeUrls: [
        "https://solana.com/news",
        "https://solana-com-media.vercel.app",
      ],
    },
  },
  templates: {
    appName: "templates",
    packageName: "solana-templates",
    workspace: "apps/templates",
    port: 3001,
    assetPrefix: "/templates-assets",
    appNameEnvironmentVariable: APP_NAME_ENVIRONMENT_VARIABLE,
    appUrlEnvironmentVariable: "NEXT_PUBLIC_TEMPLATES_APP_URL",
    appUrlEnvironmentVariableAliases: [],
    routes: [
      {
        path: "/developers/templates",
        match: "prefix",
        navigation: true,
        webMiddleware: true,
      },
    ],
    assetProxyRoutes: [
      {
        source: "/templates-assets/:path+",
        destination: "/templates-assets/:path+",
      },
    ],
    webMiddlewareAssetPrefix: true,
    vercel: {
      projectName: "templates",
      defaultHost: "https://solana-templates.vercel.app",
      scope: VERCEL_SCOPE,
    },
    secretsRollout: {
      dopplerProject: "templates",
      dopplerConfig: "production",
      smokeUrls: [
        "https://solana.com/developers/templates",
        "https://solana-templates.vercel.app",
      ],
    },
  },
  accelerate: {
    appName: "accelerate",
    packageName: "solana-com-accelerate",
    workspace: "apps/accelerate",
    port: 3004,
    assetPrefix: "/accelerate-assets",
    appNameEnvironmentVariable: APP_NAME_ENVIRONMENT_VARIABLE,
    appUrlEnvironmentVariable: "NEXT_PUBLIC_ACCELERATE_APP_URL",
    appUrlEnvironmentVariableAliases: [],
    routes: [
      {
        path: "/accelerate",
        match: "prefix",
        localized: true,
        navigation: true,
        webMiddleware: true,
      },
    ],
    assetProxyRoutes: [
      {
        source: "/accelerate-assets/_next/:path+",
        destination: "/_next/:path+",
      },
      {
        source: "/accelerate-assets/images/:path+",
        destination: "/images/:path+",
      },
      {
        source: "/accelerate-assets/:path+",
        destination: "/accelerate-assets/:path+",
      },
    ],
    webMiddlewareAssetPrefix: true,
    vercel: {
      projectName: "solana-com-accelerate",
      defaultHost: "https://solana-com-accelerate.vercel.app",
      scope: VERCEL_SCOPE,
    },
    secretsRollout: {
      dopplerProject: "solana-com-accelerate",
      dopplerConfig: "production",
      smokeUrls: [
        "https://solana.com/accelerate",
        "https://solana-com-accelerate.vercel.app",
      ],
    },
  },
  breakpoint: {
    appName: "breakpoint",
    packageName: "solana-com-breakpoint",
    workspace: "apps/breakpoint",
    port: 3005,
    assetPrefix: "/breakpoint-assets",
    appNameEnvironmentVariable: APP_NAME_ENVIRONMENT_VARIABLE,
    appUrlEnvironmentVariable: "NEXT_PUBLIC_BREAKPOINT_APP_URL",
    appUrlEnvironmentVariableAliases: [],
    routes: [
      {
        path: "/breakpoint",
        match: "prefix",
        localized: true,
        navigation: true,
        webMiddleware: true,
      },
    ],
    assetProxyRoutes: [
      {
        source: "/breakpoint-assets/:path+",
        destination: "/breakpoint-assets/:path+",
      },
    ],
    webMiddlewareAssetPrefix: true,
    vercel: {
      projectName: "solana-com-breakpoint-2",
      defaultHost: "https://solana-com-breakpoint-2.vercel.app",
      scope: VERCEL_SCOPE,
    },
    secretsRollout: {
      dopplerProject: "solana-com-breakpoint-2",
      dopplerConfig: "production",
      smokeUrls: [
        "https://solana.com/breakpoint",
        "https://solana-com-breakpoint-2.vercel.app",
      ],
    },
  },
} as const satisfies Record<AppName, AppTopologyEntry>;

export const APP_TOPOLOGY = apps;
export const APP_NAMES = Object.keys(APP_TOPOLOGY) as AppName[];
export const PROXY_APP_NAMES = APP_NAMES.filter(
  (appName): appName is ProxyAppName => appName !== "web",
);

export function isAppName(value: string): value is AppName {
  return value in APP_TOPOLOGY;
}

export function getNextPublicAppEnv(appName: ProxyAppName) {
  const app = APP_TOPOLOGY[appName];

  return {
    [app.appNameEnvironmentVariable]: app.appName,
  } as Record<typeof APP_NAME_ENVIRONMENT_VARIABLE, ProxyAppName>;
}

function matchesRoute(href: string, route: AppRoute): boolean {
  if (route.match === "exact") {
    return href === route.path;
  }

  return href === route.path || href.startsWith(`${route.path}/`);
}

export function isNavigationRoute(appName: string, href: string): boolean {
  if (!isAppName(appName) || appName === "web") {
    return false;
  }

  const routes = APP_TOPOLOGY[appName].routes as readonly AppRoute[];

  return routes.some(
    (route) => route.navigation === true && matchesRoute(href, route),
  );
}

export function isWebMiddlewareBypassRoute(href: string): boolean {
  return PROXY_APP_NAMES.some((appName) => {
    const app = APP_TOPOLOGY[appName];
    const routes = app.routes as readonly AppRoute[];

    if (
      routes.some(
        (route) => route.webMiddleware === true && matchesRoute(href, route),
      )
    ) {
      return true;
    }

    return (
      app.webMiddlewareAssetPrefix &&
      app.assetPrefix !== null &&
      (href === app.assetPrefix || href.startsWith(`${app.assetPrefix}/`))
    );
  });
}

export function getLocalAppUrl(
  appName: AppName,
  hostname = "localhost",
): string {
  return `http://${hostname}:${APP_TOPOLOGY[appName].port}`;
}

export interface CrossAppRewrite {
  source: string;
  destination: string;
  locale: false;
  has?: ReadonlyArray<{
    type: "query";
    key: string;
    value: string;
  }>;
}

export type AppUrls = Record<ProxyAppName, string>;

function expandRoute(
  route: AppRoute,
  localized = false,
): Array<{
  source: string;
  destination: string;
}> {
  const destination = route.destination ?? route.path;
  const wildcard = route.wildcard ?? "path*";
  const rewrites: Array<{ source: string; destination: string }> = [];

  if (route.match !== "descendants") {
    rewrites.push({ source: route.path, destination });
  }

  if (route.markdown === "base-and-children" && !localized) {
    rewrites.push({
      source: `${route.path}.md`,
      destination: `${destination}.md`,
    });
  }

  if (route.markdown) {
    rewrites.push({
      source: `${route.path}/:path*.md`,
      destination: `${destination}/:path*.md`,
    });
  }

  if (route.match !== "exact") {
    rewrites.push({
      source: `${route.path}/:${wildcard}`,
      destination: `${destination}/:${wildcard}`,
    });
  }

  return rewrites;
}

function createRouteRewrites(
  appName: ProxyAppName,
  appUrl: string,
): CrossAppRewrite[] {
  const routes = APP_TOPOLOGY[appName].routes as readonly AppRoute[];
  const unlocalized = routes.flatMap((route) =>
    expandRoute(route).map(({ source, destination }) => ({
      source,
      destination: `${appUrl}${destination}`,
      locale: false as const,
    })),
  );
  const localized = routes.flatMap((route) =>
    route.localized
      ? expandRoute(route, true).map(({ source, destination }) => ({
          source: `/:locale${source}`,
          destination: `${appUrl}/:locale${destination}`,
          locale: false as const,
        }))
      : [],
  );

  return [...unlocalized, ...localized];
}

function createAssetRewrites(
  appName: ProxyAppName,
  appUrl: string,
): CrossAppRewrite[] {
  const routes = APP_TOPOLOGY[appName]
    .assetProxyRoutes as readonly AssetProxyRoute[];

  return routes.map((route) => ({
    source: route.source,
    destination: `${appUrl}${route.destination}`,
    locale: false,
    ...(route.has ? { has: route.has } : {}),
  }));
}

export function createCrossAppRewrites(appUrls: AppUrls): CrossAppRewrite[] {
  return [
    ...createRouteRewrites("breakpoint", appUrls.breakpoint),
    ...createAssetRewrites("breakpoint", appUrls.breakpoint),
    ...createRouteRewrites("media", appUrls.media),
    ...createAssetRewrites("media", appUrls.media),
    ...createAssetRewrites("templates", appUrls.templates),
    ...createRouteRewrites("accelerate", appUrls.accelerate),
    ...createAssetRewrites("accelerate", appUrls.accelerate),
    ...createRouteRewrites("templates", appUrls.templates),
    ...createAssetRewrites("docs", appUrls.docs),
    ...createRouteRewrites("docs", appUrls.docs),
  ];
}

const SECRETS_ROLLOUT_ORDER: readonly AppName[] = [
  "web",
  "docs",
  "media",
  "templates",
  "accelerate",
  "breakpoint",
];

export function createSecretsRolloutManifest() {
  return {
    vercel_scope: VERCEL_SCOPE,
    projects: SECRETS_ROLLOUT_ORDER.map((appName) => {
      const app = APP_TOPOLOGY[appName];

      return {
        doppler_project: app.secretsRollout.dopplerProject,
        doppler_config: app.secretsRollout.dopplerConfig,
        vercel_project: app.vercel.projectName,
        vercel_scope: app.vercel.scope,
        smoke_urls: [...app.secretsRollout.smokeUrls],
      };
    }),
  };
}

import { withRelatedProject } from "@vercel/related-projects";
import {
  APP_TOPOLOGY,
  PROXY_APP_NAMES,
  getLocalAppUrl,
  type AppUrls,
  type ProxyAppName,
} from "@workspace/app-topology";

function resolveAppUrl(appName: ProxyAppName): string {
  const app = APP_TOPOLOGY[appName];
  const environmentUrl = process.env[app.appUrlEnvironmentVariable];

  if (environmentUrl) {
    return environmentUrl;
  }

  if (process.env.NODE_ENV === "production") {
    return withRelatedProject({
      projectName: app.vercel.projectName,
      defaultHost: app.vercel.defaultHost,
    });
  }

  return getLocalAppUrl(appName);
}

export const APP_URLS = Object.fromEntries(
  PROXY_APP_NAMES.map((appName) => [appName, resolveAppUrl(appName)]),
) as AppUrls;

export const MEDIA_APP_URL = APP_URLS.media;
export const DOCS_APP_URL = APP_URLS.docs;
export const TEMPLATES_APP_URL = APP_URLS.templates;
export const ACCELERATE_APP_URL = APP_URLS.accelerate;
export const BREAKPOINT_APP_URL = APP_URLS.breakpoint;

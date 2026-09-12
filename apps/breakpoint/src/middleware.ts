import {
  createMiddleware,
  routingWithoutDetection,
} from "@workspace/i18n/middleware";

export default createMiddleware(routingWithoutDetection, {
  preserveProxiedLocaleCookie: true,
});

export const config = {
  // The app is served at /breakpoint in production, while the standalone
  // dev server rewrites that mounted API path back to /api. Keep both forms
  // out of locale routing so the rewrite can reach the route handler.
  matcher: ["/((?!api|breakpoint/api|_next|_vercel|.*\\..*).*)"],
};

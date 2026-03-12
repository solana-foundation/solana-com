import {
  createMiddleware,
  routingWithoutDetection,
} from "@workspace/i18n/middleware";

export default createMiddleware(routingWithoutDetection, {
  preserveProxiedLocaleCookie: true,
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

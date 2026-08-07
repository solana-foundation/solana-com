/**
 * Same-origin by default: apps/web rewrites /api/ask/* to the docs-agent
 * service. Apps served off-domain (or local dev against a local agent) can
 * point elsewhere with NEXT_PUBLIC_ASK_API_URL.
 */
export function askApiBase(): string {
  return process.env.NEXT_PUBLIC_ASK_API_URL || "/api/ask";
}

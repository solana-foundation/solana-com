import { makeRouteHandler } from "@keystatic/next/route-handler";
import keystatic from "../../../../keystatic.config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const isLocal = process.env.KEYSTATIC_LOCAL === "true";

let _handler: ReturnType<typeof makeRouteHandler> | undefined;

function getHandler() {
  if (!_handler) {
    _handler = makeRouteHandler({ config: keystatic });
  }
  return _handler;
}

/**
 * Inject the GitHub token from env into the request cookie header
 * so Keystatic's server-side handler can read it — without ever
 * exposing the PAT in a client-readable cookie.
 *
 * Only used in GitHub mode. In local mode, requests are passed
 * directly to avoid unnecessary Request object wrapping that can
 * cause body stream issues.
 */
function withGitHubToken(request: Request): Request {
  const token = process.env.KEYSTATIC_GITHUB_TOKEN;
  if (!token) return request;

  const existingCookies = request.headers.get("cookie") || "";
  if (existingCookies.includes("keystatic-gh-access-token=")) {
    return request;
  }

  const injected = existingCookies
    ? `${existingCookies}; keystatic-gh-access-token=${token}`
    : `keystatic-gh-access-token=${token}`;

  const headers = new Headers(request.headers);
  headers.set("cookie", injected);
  return new Request(request.url, {
    method: request.method,
    headers,
    body: request.body,
    // @ts-expect-error duplex needed for streaming body
    duplex: "half",
  });
}

function isRefreshTokenRequest(request: Request): boolean {
  const url = new URL(request.url);
  return url.pathname.endsWith("/github/refresh-token");
}

export async function GET(request: Request) {
  const { GET: _GET } = getHandler();
  if (isLocal) return _GET(request);
  return _GET(withGitHubToken(request));
}

export async function POST(request: Request) {
  const { POST: _POST } = getHandler();
  // In local mode, pass requests directly to Keystatic's handler
  if (isLocal) return _POST(request);

  // For refresh-token requests, set a short-lived cookie so Keystatic's
  // client can authenticate its direct GitHub API calls
  if (isRefreshTokenRequest(request)) {
    const token = process.env.KEYSTATIC_GITHUB_TOKEN;
    if (token) {
      return new Response(null, {
        status: 200,
        headers: {
          "Set-Cookie": [
            `keystatic-gh-access-token=${token}`,
            "Path=/",
            "SameSite=Lax",
            process.env.NODE_ENV === "production" ? "Secure" : "",
            "Max-Age=3600",
          ]
            .filter(Boolean)
            .join("; "),
        },
      });
    }
  }
  return _POST(withGitHubToken(request));
}

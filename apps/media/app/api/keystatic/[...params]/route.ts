import { makeRouteHandler } from "@keystatic/next/route-handler";
import keystatic from "../../../../keystatic.config";

const { GET: _GET, POST: _POST } = makeRouteHandler({
  config: keystatic,
});

/**
 * Inject the GitHub token from env into the request cookie header
 * so Keystatic's server-side handler can read it — without ever
 * exposing the PAT in a client-readable cookie.
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
  return _GET(withGitHubToken(request));
}

export async function POST(request: Request) {
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

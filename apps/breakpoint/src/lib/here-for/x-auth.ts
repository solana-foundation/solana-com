import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { defaultLocale } from "@workspace/i18n/config";
import { localizedRouteUrl } from "@/config";
import { signAwardsValue } from "@/lib/awards-session";
import { normalizeHandle } from "./handles";
import type { HereForHandle } from "./types";

/**
 * "Sign in with X" for Here For, using OAuth 1.0a three-legged auth with the
 * app's consumer key. X's access_token step returns the user's screen_name, so
 * no extra API call is needed to learn who signed in.
 */

const X_API = "https://api.x.com";
const SESSION_COOKIE = "here_for_x";
const REQUEST_COOKIE = "here_for_x_request";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const REQUEST_MAX_AGE = 60 * 10;

export type XSession = { userId: string; handle: HereForHandle };

function credentials() {
  const key = process.env.X_CONSUMER_KEY;
  const secret = process.env.X_SECRET_KEY;
  if (!key || !secret)
    throw new Error("X_CONSUMER_KEY and X_SECRET_KEY must be set.");
  return { key, secret };
}

export function xCallbackUrl() {
  return (
    process.env.X_OAUTH_CALLBACK_URL ||
    localizedRouteUrl(defaultLocale, "/api/here-for/x/callback")
  );
}

// RFC 3986 encoding, which OAuth 1.0a signatures require.
const encode = (value: string) =>
  encodeURIComponent(value).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );

export function oauthHeader(
  method: string,
  url: string,
  params: Record<string, string>,
  consumer: { key: string; secret: string },
  tokenSecret = "",
  nonce = randomBytes(16).toString("hex"),
  timestamp = String(Math.floor(Date.now() / 1000)),
) {
  const oauth: Record<string, string> = {
    oauth_consumer_key: consumer.key,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_version: "1.0",
    ...params,
  };
  const base = [
    method.toUpperCase(),
    encode(url),
    encode(
      Object.keys(oauth)
        .sort()
        .map((k) => `${encode(k)}=${encode(oauth[k]!)}`)
        .join("&"),
    ),
  ].join("&");
  oauth.oauth_signature = createHmac(
    "sha1",
    `${encode(consumer.secret)}&${encode(tokenSecret)}`,
  )
    .update(base)
    .digest("base64");
  return `OAuth ${Object.keys(oauth)
    .sort()
    .map((k) => `${encode(k)}="${encode(oauth[k]!)}"`)
    .join(", ")}`;
}

async function oauthPost(
  path: string,
  params: Record<string, string>,
  tokenSecret?: string,
) {
  const url = `${X_API}${path}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: oauthHeader(
        "POST",
        url,
        params,
        credentials(),
        tokenSecret,
      ),
    },
    cache: "no-store",
  });
  const text = await response.text();
  if (!response.ok)
    throw new Error(
      `X ${path} failed: ${response.status} ${text.slice(0, 200)}`,
    );
  return new URLSearchParams(text);
}

/** Step 1: get a request token and the URL to send the user to. */
export async function startXSignIn() {
  const body = await oauthPost("/oauth/request_token", {
    oauth_callback: xCallbackUrl(),
  });
  const token = body.get("oauth_token");
  const secret = body.get("oauth_token_secret");
  if (!token || !secret || body.get("oauth_callback_confirmed") !== "true")
    throw new Error("X request_token returned an unexpected body");
  return {
    token,
    secret,
    authorizeUrl: `${X_API}/oauth/authenticate?oauth_token=${encode(token)}`,
  };
}

/** Step 3: trade the verifier for an access token and the user's identity. */
export async function finishXSignIn(
  token: string,
  tokenSecret: string,
  verifier: string,
): Promise<XSession> {
  const body = await oauthPost(
    "/oauth/access_token",
    { oauth_token: token, oauth_verifier: verifier },
    tokenSecret,
  );
  const userId = body.get("user_id");
  const handle = normalizeHandle(body.get("screen_name"));
  if (!userId || !/^\d+$/.test(userId) || !handle)
    throw new Error("X access_token returned an unexpected body");
  return { userId, handle };
}

function seal(payload: string) {
  const value = Buffer.from(payload).toString("base64url");
  return `${value}.${signAwardsValue(value)}`;
}

function unseal(cookie: string | undefined) {
  if (!cookie) return null;
  const [value, received] = cookie.split(".");
  if (!value || !received) return null;
  const a = Buffer.from(received);
  const b = Buffer.from(signAwardsValue(value));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString()) as unknown;
  } catch {
    return null;
  }
}

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  maxAge,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
});

/** Only same-site paths, so the callback can't be used as an open redirect. */
export function safeReturnPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value.includes("\\") ? null : value;
}

export const xRequestCookie = {
  name: REQUEST_COOKIE,
  value: (token: string, secret: string, returnTo: string) =>
    seal(JSON.stringify({ token, secret, returnTo })),
  options: cookieOptions(REQUEST_MAX_AGE),
};

export function readXRequest(request: NextRequest) {
  const data = unseal(request.cookies.get(REQUEST_COOKIE)?.value) as {
    token?: unknown;
    secret?: unknown;
    returnTo?: unknown;
  } | null;
  if (
    typeof data?.token !== "string" ||
    typeof data.secret !== "string" ||
    typeof data.returnTo !== "string"
  )
    return null;
  return { token: data.token, secret: data.secret, returnTo: data.returnTo };
}

export const xSessionCookie = {
  name: SESSION_COOKIE,
  value: (session: XSession) => seal(JSON.stringify(session)),
  options: cookieOptions(SESSION_MAX_AGE),
};

export function readXSession(request: NextRequest): XSession | null {
  const data = unseal(request.cookies.get(SESSION_COOKIE)?.value) as {
    userId?: unknown;
    handle?: unknown;
  } | null;
  const handle = normalizeHandle(data?.handle);
  if (typeof data?.userId !== "string" || !handle) return null;
  return { userId: data.userId, handle };
}

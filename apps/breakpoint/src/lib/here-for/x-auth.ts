import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "@workspace/i18n/config";
import { localizedRoutePath, localizedRouteUrl } from "@/config";
import { awardsPrisma } from "@/lib/awards-db";
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

function seal(payload: Record<string, unknown>, maxAge: number) {
  const value = Buffer.from(
    JSON.stringify({
      ...payload,
      expiresAt: Date.now() + maxAge * 1000,
    }),
  ).toString("base64url");
  return `${value}.${signAwardsValue(value)}`;
}

function unseal(cookie: string | undefined) {
  if (!cookie) return null;
  const [value, received, extra] = cookie.split(".");
  if (!value || !received || extra !== undefined) return null;
  const a = Buffer.from(received);
  const b = Buffer.from(signAwardsValue(value));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data: unknown = JSON.parse(
      Buffer.from(value, "base64url").toString(),
    );
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    const payload = data as Record<string, unknown>;
    if (
      typeof payload.expiresAt !== "number" ||
      !Number.isSafeInteger(payload.expiresAt) ||
      payload.expiresAt <= Date.now()
    )
      return null;
    return payload;
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

/** Normalize before checking the origin and the allowed mutuals routes. */
export function safeReturnPath(value: string | null) {
  // URL parsing strips controls, which can turn a relative path into //host.
  // eslint-disable-next-line no-control-regex
  if (!value || !value.startsWith("/") || /[\\\u0000-\u0020\u007f]/.test(value))
    return null;
  try {
    const base = "https://return.invalid";
    const url = new URL(value, base);
    if (url.origin !== base) return null;
    const allowed = locales.some((locale) => {
      const root = localizedRoutePath(locale, "/mutuals");
      return (
        url.pathname === root ||
        url.pathname === `${root}/` ||
        (url.pathname.startsWith(`${root}/`) &&
          /^[a-z0-9_]{1,15}\/?$/i.test(url.pathname.slice(root.length + 1)))
      );
    });
    return allowed ? `${url.pathname}${url.search}${url.hash}` : null;
  } catch {
    return null;
  }
}

export const xRequestCookie = {
  name: REQUEST_COOKIE,
  value: (token: string, secret: string, returnTo: string) =>
    seal({ token, secret, returnTo }, REQUEST_MAX_AGE),
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
  const returnTo = safeReturnPath(data.returnTo);
  return returnTo ? { token: data.token, secret: data.secret, returnTo } : null;
}

export const xSessionCookie = {
  name: SESSION_COOKIE,
  value: async (session: XSession) => {
    await awardsPrisma.hereForXSession.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });
    const record = await awardsPrisma.hereForXSession.create({
      data: {
        xUserId: session.userId,
        handle: session.handle,
        expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000),
      },
    });
    return seal({ sessionId: record.id }, SESSION_MAX_AGE);
  },
  options: cookieOptions(SESSION_MAX_AGE),
};

function sessionId(request: NextRequest) {
  const data = unseal(request.cookies.get(SESSION_COOKIE)?.value);
  return typeof data?.sessionId === "string" &&
    /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(
      data.sessionId,
    )
    ? data.sessionId
    : null;
}

export async function readXSession(
  request: NextRequest,
): Promise<XSession | null> {
  const id = sessionId(request);
  if (!id) return null;
  const session = await awardsPrisma.hereForXSession.findUnique({
    where: { id, expiresAt: { gt: new Date() } },
  });
  const handle = normalizeHandle(session?.handle);
  return session && handle ? { userId: session.xUserId, handle } : null;
}

export async function revokeXSession(request: NextRequest) {
  const id = sessionId(request);
  if (id) await awardsPrisma.hereForXSession.deleteMany({ where: { id } });
}

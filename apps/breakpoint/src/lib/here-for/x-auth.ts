import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "@workspace/i18n/config";
import { localizedRoutePath, localizedRouteUrl } from "@/config";
import { awardsPrisma } from "@/lib/awards-db";
import { signAwardsValue } from "@/lib/awards-session";
import { normalizeHandle } from "./handles";
import type { HereForHandle } from "./types";

/**
 * "Sign in with X" for Here For, using OAuth 2.0 with PKCE and the two
 * narrowest scopes X offers for reading who signed in. The token is used once
 * for GET /2/users/me and revoked straight away; nothing else is read.
 *
 * The PKCE verifier and return path travel encrypted inside `state` rather
 * than in a cookie. On phones X often hands the consent screen to its app and
 * then opens the callback in a different browser than the one that started
 * sign-in, where a request cookie would be missing.
 */

const X_API = "https://api.x.com";
const X_AUTHORIZE = "https://x.com/i/oauth2/authorize";
const X_SCOPES = "users.read tweet.read";
const SESSION_COOKIE = "here_for_x";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const STATE_MAX_AGE = 60 * 10;

export type XSession = { userId: string; handle: HereForHandle };

function client() {
  const id = process.env.X_CLIENT_ID;
  if (!id) throw new Error("X_CLIENT_ID must be set.");
  return { id, secret: process.env.X_CLIENT_SECRET || null };
}

export function xCallbackUrl() {
  return (
    process.env.X_OAUTH_CALLBACK_URL ||
    localizedRouteUrl(defaultLocale, "/api/here-for/x/callback")
  );
}

// AES-256-GCM key derived from the awards cookie secret.
const stateKey = () =>
  Buffer.from(signAwardsValue("here-for-x-oauth-state"), "base64url");

/** Encrypts the PKCE verifier and return path into the OAuth `state`. */
export function sealXState(verifier: string, returnTo: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", stateKey(), iv);
  const body = Buffer.concat([
    cipher.update(
      JSON.stringify({
        v: verifier,
        r: returnTo,
        e: Date.now() + STATE_MAX_AGE * 1000,
      }),
    ),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}

export function openXState(state: string | null) {
  if (!state || state.length > 1024) return null;
  try {
    const raw = Buffer.from(state, "base64url");
    if (raw.length < 29) return null;
    const decipher = createDecipheriv(
      "aes-256-gcm",
      stateKey(),
      raw.subarray(0, 12),
    );
    decipher.setAuthTag(raw.subarray(12, 28));
    const data: unknown = JSON.parse(
      Buffer.concat([
        decipher.update(raw.subarray(28)),
        decipher.final(),
      ]).toString(),
    );
    if (!data || typeof data !== "object") return null;
    const { v, r, e } = data as Record<string, unknown>;
    if (typeof v !== "string" || typeof r !== "string" || typeof e !== "number")
      return null;
    if (e <= Date.now()) return null;
    const returnTo = safeReturnPath(r);
    return returnTo ? { verifier: v, returnTo } : null;
  } catch {
    return null;
  }
}

/** Step 1: the URL to send the user to, with PKCE and encrypted state. */
export function startXSignIn(returnTo: string) {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const url = new URL(X_AUTHORIZE);
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: client().id,
    redirect_uri: xCallbackUrl(),
    scope: X_SCOPES,
    state: sealXState(verifier, returnTo),
    code_challenge: challenge,
    code_challenge_method: "S256",
  }).toString();
  return url.toString();
}

async function xPost(path: string, params: Record<string, string>) {
  const { id, secret } = client();
  const response = await fetch(`${X_API}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      // Web App clients are confidential; Native App clients send only the id.
      ...(secret
        ? {
            Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
          }
        : {}),
    },
    body: new URLSearchParams({ client_id: id, ...params }),
    cache: "no-store",
  });
  const text = await response.text();
  if (!response.ok)
    throw new Error(
      `X ${path} failed: ${response.status} ${text.slice(0, 200)}`,
    );
  return text;
}

/** Step 2: trade the code for a token, read who it is, then revoke it. */
export async function finishXSignIn(
  code: string,
  verifier: string,
): Promise<XSession> {
  const token = (
    JSON.parse(
      await xPost("/2/oauth2/token", {
        grant_type: "authorization_code",
        code,
        redirect_uri: xCallbackUrl(),
        code_verifier: verifier,
      }),
    ) as { access_token?: unknown }
  ).access_token;
  if (typeof token !== "string")
    throw new Error("X token returned an unexpected body");
  try {
    const response = await fetch(`${X_API}/2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok)
      throw new Error(`X /2/users/me failed: ${response.status}`);
    const { data } = (await response.json()) as {
      data?: { id?: unknown; username?: unknown };
    };
    const userId = data?.id;
    const handle = normalizeHandle(data?.username);
    if (typeof userId !== "string" || !/^\d+$/.test(userId) || !handle)
      throw new Error("X /2/users/me returned an unexpected body");
    return { userId, handle };
  } finally {
    // We only needed the handle, so give the access back right away.
    await xPost("/2/oauth2/revoke", {
      token,
      token_type_hint: "access_token",
    }).catch(() => {});
  }
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

/**
 * Marks a sign-in that just finished, so the add page may save the picks that
 * came back with it. Only the callback sets it; a link carrying ?picks= can't,
 * which stops a crafted URL from overwriting a signed-in visitor's picks. The
 * page reads and clears it, hence not httpOnly.
 */
export const xReturnCookie = {
  name: "here_for_x_return",
  value: "1",
  options: { ...cookieOptions(60), httpOnly: false },
};

export const xSessionCookie = {
  name: SESSION_COOKIE,
  value: async (session: XSession) => {
    const record = await awardsPrisma.$transaction(
      async (tx) => {
        // Only fresh OAuth proof may change the account associated with a handle.
        await tx.hereForPerson.upsert({
          where: { handle: session.handle },
          create: { handle: session.handle, xUserId: session.userId },
          update: { xUserId: session.userId },
        });
        await tx.hereForXSession.deleteMany({
          where: {
            OR: [
              { expiresAt: { lte: new Date() } },
              { handle: session.handle, xUserId: { not: session.userId } },
              { xUserId: session.userId, handle: { not: session.handle } },
            ],
          },
        });
        return tx.hereForXSession.create({
          data: {
            xUserId: session.userId,
            handle: session.handle,
            expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000),
          },
        });
      },
      {
        isolationLevel: "Serializable",
      },
    );
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

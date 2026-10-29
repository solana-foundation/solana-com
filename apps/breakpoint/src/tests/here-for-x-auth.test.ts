import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { signAwardsValue } from "@/lib/awards-session";
import { handleFromInput } from "@/lib/here-for/handles";
import {
  safeReturnPath,
  sealXState,
  openXState,
  startXSignIn,
  xSessionCookie,
  readXSession,
  finishXSignIn,
} from "@/lib/here-for/x-auth";
import { GET as callback } from "@/app/api/here-for/x/callback/route";
import { POST as logout } from "@/app/api/here-for/x/logout/route";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  find: vi.fn(),
  remove: vi.fn(),
  claim: vi.fn(),
}));
vi.mock("@/lib/awards-db", () => ({
  awardsPrisma: {
    $transaction: (work: (tx: unknown) => unknown) =>
      work({
        hereForPerson: { upsert: mocks.claim },
        hereForXSession: { create: mocks.create, deleteMany: mocks.remove },
      }),
    hereForXSession: {
      create: mocks.create,
      findUnique: mocks.find,
      deleteMany: mocks.remove,
    },
  },
}));
const id = "11111111-1111-4111-8111-111111111111";
const identity = { userId: "123", handle: "@alice" as const };
const returnTo = "/breakpoint/mutuals/add?add=bob";
const cookieRequest = (name: string, value: string) =>
  new NextRequest("https://solana.com/breakpoint/api/here-for/me", {
    headers: { cookie: `${name}=${value}` },
  });
const signedPayload = (payload: Record<string, unknown>) => {
  const value = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${value}.${signAwardsValue(value)}`;
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-29T00:00:00Z"));
  mocks.create.mockResolvedValue({ id });
  mocks.find.mockResolvedValue({
    id,
    xUserId: identity.userId,
    handle: identity.handle,
  });
  mocks.remove.mockResolvedValue({ count: 0 });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("here-for X auth", () => {
  const xResponses = (username = "Alice") => {
    const fetch = vi.fn(async (url: string, _init?: RequestInit) => {
      if (url.endsWith("/2/oauth2/token"))
        return Response.json({ access_token: "access", token_type: "bearer" });
      if (url.endsWith("/2/users/me"))
        return Response.json({ data: { id: "123", username, name: "A" } });
      return new Response("{}");
    });
    vi.stubGlobal("fetch", fetch);
    return fetch;
  };

  it("matches a mixed-case X login to the normalized handle already added", async () => {
    vi.stubEnv("X_CLIENT_ID", "client");
    vi.stubEnv("X_CLIENT_SECRET", "secret");
    xResponses();
    const session = await finishXSignIn("code", "verifier");
    expect(session).toEqual(identity);
    await xSessionCookie.value(session);
    // Updating only the identity keeps the placeholder's ID and incoming edges.
    expect(mocks.claim).toHaveBeenCalledWith({
      where: { handle: "@alice" },
      create: { handle: "@alice", xUserId: "123" },
      update: { xUserId: "123" },
    });
  });

  it("asks X only for the two read scopes and uses PKCE", () => {
    vi.stubEnv("X_CLIENT_ID", "client");
    const url = new URL(startXSignIn(returnTo));
    expect(url.origin + url.pathname).toBe("https://x.com/i/oauth2/authorize");
    expect(url.searchParams.get("scope")).toBe("users.read tweet.read");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("client_id")).toBe("client");
    expect(openXState(url.searchParams.get("state"))?.returnTo).toBe(returnTo);
  });

  it("revokes the token after reading the handle, even when the read fails", async () => {
    vi.stubEnv("X_CLIENT_ID", "client");
    const fetch = xResponses("not a handle!");
    await expect(finishXSignIn("code", "verifier")).rejects.toThrow();
    const revoke = fetch.mock.calls.find(([url]) =>
      String(url).endsWith("/2/oauth2/revoke"),
    );
    expect(String(revoke?.[1]?.body)).toContain("token=access");
  });

  it("completes sign-in from a browser that never saw the login", async () => {
    vi.stubEnv("X_CLIENT_ID", "client");
    vi.stubEnv(
      "X_OAUTH_CALLBACK_URL",
      "https://solana.com/breakpoint/api/here-for/x/callback",
    );
    xResponses();
    const state = sealXState("verifier", returnTo);
    const response = await callback(
      new NextRequest(
        `https://solana.com/breakpoint/api/here-for/x/callback?code=c&state=${state}`,
      ),
    );
    expect(response.headers.get("location")).toBe(
      `https://solana.com${returnTo}`,
    );
    expect(response.headers.get("set-cookie")).toContain("here_for_x=");
  });

  it("sends a cancelled sign-in back to the picks with a notice", async () => {
    vi.stubEnv(
      "X_OAUTH_CALLBACK_URL",
      "https://solana.com/breakpoint/api/here-for/x/callback",
    );
    const state = sealXState("verifier", returnTo);
    const response = await callback(
      new NextRequest(
        `https://solana.com/breakpoint/api/here-for/x/callback?error=access_denied&state=${state}`,
      ),
    );
    expect(response.headers.get("location")).toBe(
      `https://solana.com${returnTo}&x=denied`,
    );
  });

  it("reads handles from typed text and pasted X profile links", () => {
    for (const [input, handle] of [
      ["alice", "@alice"],
      [" @Alice ", "@alice"],
      ["https://x.com/Alice?s=21&t=abc", "@alice"],
      ["x.com/alice", "@alice"],
      ["https://twitter.com/alice/", "@alice"],
      ["https://mobile.twitter.com/alice", "@alice"],
      ["https://evil.test/alice", null],
      ["two words", null],
    ] as const)
      expect(handleFromInput(input)).toBe(handle);
  });

  it("preserves mutuals routes, locales and query strings", () => {
    for (const path of [
      "/breakpoint/mutuals",
      returnTo,
      "/breakpoint/mutuals/find",
      "/breakpoint/mutuals/alice",
      "/fr/breakpoint/mutuals/add?add=bob#picks",
      "/breakpoint/mutuals/",
    ])
      expect(safeReturnPath(path)).toBe(path);
    expect(safeReturnPath("/breakpoint/mutuals/find/../add")).toBe(
      "/breakpoint/mutuals/add",
    );
  });

  it("rejects external redirects and routes outside mutuals after normalization", () => {
    for (const bad of [
      null,
      "https://evil.test",
      "//evil.test",
      "/\\evil.test",
      "/\t/evil.test",
      "/\n/evil.test",
      "/\r/evil.test",
      "/breakpoint/mutuals/../../api/here-for/x/login",
      "/breakpoint/mutuals-other",
      "/breakpoint/mutuals/alice/extra",
      "/breakpoint/mutuals/%2e%2e/awards",
      "/breakpoint/awards",
    ])
      expect(safeReturnPath(bad)).toBeNull();
  });

  it("expires OAuth state after ten minutes and rejects tampering", () => {
    const state = sealXState("verifier", returnTo);
    expect(openXState(state)).toEqual({ verifier: "verifier", returnTo });
    const raw = Buffer.from(state, "base64url");
    raw[raw.length - 1] = raw[raw.length - 1]! ^ 1;
    expect(openXState(raw.toString("base64url"))).toBeNull();
    vi.advanceTimersByTime(10 * 60 * 1000);
    expect(openXState(state)).toBeNull();
  });

  it("revalidates return paths stored in OAuth state", () => {
    expect(openXState(sealXState("verifier", "/\t/evil.test"))).toBeNull();
  });

  it("accepts a persisted session until its 30-day server expiry", async () => {
    const cookie = await xSessionCookie.value(identity);
    const request = cookieRequest(xSessionCookie.name, cookie);
    expect(mocks.create).toHaveBeenCalledWith({
      data: {
        xUserId: identity.userId,
        handle: identity.handle,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    expect(await readXSession(request)).toEqual(identity);
    vi.advanceTimersByTime(30 * 24 * 60 * 60 * 1000 - 1);
    expect(await readXSession(request)).toEqual(identity);
    mocks.find.mockClear();
    vi.advanceTimersByTime(1);
    expect(await readXSession(request)).toBeNull();
    expect(mocks.find).not.toHaveBeenCalled();
  });

  it("requires an unexpired database session even with a valid cookie", async () => {
    const request = cookieRequest(
      xSessionCookie.name,
      await xSessionCookie.value(identity),
    );
    mocks.find.mockResolvedValue(null);
    expect(await readXSession(request)).toBeNull();
    expect(mocks.find).toHaveBeenCalledWith({
      where: { id, expiresAt: { gt: new Date() } },
    });
  });

  it("binds a fresh sign-in to the stable account and revokes stale handle sessions", async () => {
    await xSessionCookie.value(identity);
    expect(mocks.claim).toHaveBeenCalledWith({
      where: { handle: "@alice" },
      create: { handle: "@alice", xUserId: "123" },
      update: { xUserId: "123" },
    });
    expect(mocks.remove).toHaveBeenCalledWith({
      where: {
        OR: [
          { expiresAt: { lte: new Date() } },
          { handle: "@alice", xUserId: { not: "123" } },
          { xUserId: "123", handle: { not: "@alice" } },
        ],
      },
    });
  });

  it("rejects legacy, malformed and tampered sessions before database access", async () => {
    const cookie = await xSessionCookie.value(identity);
    const [value, signature] = cookie.split(".");
    const legacy = signedPayload(identity);
    for (const invalid of [
      legacy,
      `${value}.bad`,
      `${cookie}.extra`,
      `${value}x.${signature}`,
      signedPayload({ sessionId: "invalid", expiresAt: Date.now() + 1000 }),
      signedPayload({ sessionId: id, expiresAt: "tomorrow" }),
    ])
      expect(
        await readXSession(cookieRequest(xSessionCookie.name, invalid)),
      ).toBeNull();
    expect(mocks.find).not.toHaveBeenCalled();
  });

  it("revokes the session on logout so a copied cookie cannot be replayed", async () => {
    const cookie = await xSessionCookie.value(identity);
    const request = cookieRequest(xSessionCookie.name, cookie);
    expect(await readXSession(request)).toEqual(identity);
    mocks.remove.mockImplementation(async () => {
      mocks.find.mockResolvedValue(null);
      return { count: 1 };
    });
    const response = await logout(
      new NextRequest("https://solana.com/breakpoint/api/here-for/x/logout", {
        method: "POST",
        headers: {
          origin: "https://solana.com",
          cookie: `${xSessionCookie.name}=${cookie}`,
        },
      }),
    );
    expect(response.status).toBe(204);
    expect(mocks.remove).toHaveBeenLastCalledWith({ where: { id } });
    expect(response.headers.get("set-cookie")).toContain("here_for_x=;");
    expect(await readXSession(request)).toBeNull();
  });

  it("does not report successful logout when revocation fails", async () => {
    const cookie = await xSessionCookie.value(identity);
    mocks.remove.mockRejectedValue(new Error("Database unavailable"));
    const response = await logout(
      new NextRequest("https://solana.com/breakpoint/api/here-for/x/logout", {
        method: "POST",
        headers: {
          origin: "https://solana.com",
          cookie: `${xSessionCookie.name}=${cookie}`,
        },
      }),
    );
    expect(response.status).toBe(503);
    expect(response.headers.get("set-cookie")).toBeNull();
  });
});

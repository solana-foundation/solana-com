import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { signAwardsValue } from "@/lib/awards-session";
import {
  oauthHeader,
  safeReturnPath,
  xRequestCookie,
  readXRequest,
  xSessionCookie,
  readXSession,
} from "@/lib/here-for/x-auth";
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
});

describe("here-for X auth", () => {
  // Worked example from X's "Creating a signature" OAuth 1.0a docs.
  it("signs requests the way X documents", () => {
    const header = oauthHeader(
      "post",
      "https://api.twitter.com/1.1/statuses/update.json",
      {
        include_entities: "true",
        status: "Hello Ladies + Gentlemen, a signed OAuth request!",
        oauth_token: "370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb",
      },
      {
        key: "xvz1evFS4wEEPTGEFPHBog",
        secret: "kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw",
      },
      "LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE",
      "kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg",
      "1318622958",
    );
    expect(header).toContain(
      `oauth_signature="${encodeURIComponent("hCtSmYh+iHYCEqBWrE7C7hYmtUk=")}"`,
    );
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

  it("expires OAuth request cookies on the server after ten minutes", () => {
    const request = cookieRequest(
      xRequestCookie.name,
      xRequestCookie.value("token", "secret", returnTo),
    );
    expect(readXRequest(request)).toEqual({
      token: "token",
      secret: "secret",
      returnTo,
    });
    vi.advanceTimersByTime(10 * 60 * 1000);
    expect(readXRequest(request)).toBeNull();
  });

  it("revalidates return paths stored in signed request cookies", () => {
    const request = cookieRequest(
      xRequestCookie.name,
      xRequestCookie.value("token", "secret", "/\t/evil.test"),
    );
    expect(readXRequest(request)).toBeNull();
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

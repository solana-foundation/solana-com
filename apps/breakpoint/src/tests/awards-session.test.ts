import { afterEach, describe, expect, it, vi } from "vitest";
import { createHmac } from "node:crypto";
import { NextRequest } from "next/server";
import {
  awardsBallotCookie,
  newAwardsBallot,
  readAwardsBallot,
} from "@/lib/awards-session";

const originalEnvironment = { ...process.env };

afterEach(() => {
  vi.unstubAllEnvs();
  process.env = { ...originalEnvironment };
});

describe("awards ballot session", () => {
  it("accepts a server-signed ballot cookie", () => {
    vi.stubEnv("AWARDS_COOKIE_SECRET", "a".repeat(32));
    const ballot = newAwardsBallot();
    const request = new NextRequest(
      "https://solana.com/breakpoint/api/nominations",
      {
        headers: { cookie: `${awardsBallotCookie.name}=${ballot.value}` },
      },
    );

    expect(readAwardsBallot(request)).toBe(ballot.ballotId);
  });

  it("rejects a changed ballot identifier", () => {
    vi.stubEnv("AWARDS_COOKIE_SECRET", "a".repeat(32));
    const ballot = newAwardsBallot();
    const [ballotId, signature] = ballot.value.split(".");
    const replacement = ballotId?.endsWith("0") ? "1" : "0";
    const request = new NextRequest(
      "https://solana.com/breakpoint/api/nominations",
      {
        headers: {
          cookie: `${awardsBallotCookie.name}=${ballotId?.replace(/.$/, replacement)}.${signature}`,
        },
      },
    );

    expect(readAwardsBallot(request)).toBeNull();
  });

  it("issues ballots with a signed issue time and rejects them after 120 days", () => {
    vi.stubEnv("AWARDS_COOKIE_SECRET", "a".repeat(32));
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-03T00:00:00Z"));
    try {
      const ballot = newAwardsBallot();
      expect(ballot.value.split(".")).toHaveLength(3);
      const request = new NextRequest(
        "https://solana.com/breakpoint/api/votes",
        {
          headers: { cookie: `${awardsBallotCookie.name}=${ballot.value}` },
        },
      );
      expect(readAwardsBallot(request)).toBe(ballot.ballotId);
      vi.advanceTimersByTime(120 * 24 * 60 * 60 * 1000 + 1000);
      expect(readAwardsBallot(request)).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("rejects a forged issue time and still accepts the legacy two-part cookie", () => {
    vi.stubEnv("AWARDS_COOKIE_SECRET", "a".repeat(32));
    const sign = (value: string) =>
      createHmac("sha256", "a".repeat(32)).update(value).digest("base64url");
    const ballotId = "11111111-1111-4111-8111-111111111111";
    const fresh = String(Math.floor(Date.now() / 1000));
    const forged = `${ballotId}.${fresh}.${sign(ballotId)}`; // signed without the time
    const legacy = `${ballotId}.${sign(ballotId)}`;
    const read = (cookie: string) =>
      readAwardsBallot(
        new NextRequest("https://solana.com/breakpoint/api/votes", {
          headers: { cookie: `${awardsBallotCookie.name}=${cookie}` },
        }),
      );
    expect(read(forged)).toBeNull();
    expect(read(legacy)).toBe(ballotId);
  });
});

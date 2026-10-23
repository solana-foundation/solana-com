import { afterEach, describe, expect, it, vi } from "vitest";
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
});

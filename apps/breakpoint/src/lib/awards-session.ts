import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "breakpoint_awards_ballot";
const UUID_PATTERN =
  /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const BALLOT_MAX_AGE_SECONDS = 60 * 60 * 24 * 120;

function secret() {
  const value = process.env.AWARDS_COOKIE_SECRET;
  if (value && value.length >= 32) return value;
  if (process.env.NODE_ENV !== "production") {
    return "breakpoint-awards-development-secret-not-for-production";
  }
  throw new Error(
    "AWARDS_COOKIE_SECRET must be set to at least 32 characters.",
  );
}

export function signAwardsValue(ballotId: string) {
  return createHmac("sha256", secret()).update(ballotId).digest("base64url");
}

function signatureMatches(payload: string, receivedSignature: string) {
  const received = Buffer.from(receivedSignature);
  const expected = Buffer.from(signAwardsValue(payload));
  return (
    received.length === expected.length && timingSafeEqual(received, expected)
  );
}

/**
 * Ballot cookies are `uuid.issuedAt.signature`. The issue time is part of the
 * signed payload, so a copied cookie stops working after the ballot's maximum
 * age even though the secret has not rotated. The older two-part
 * `uuid.signature` form is still accepted during the transition.
 */
export function readAwardsBallot(request: NextRequest) {
  const value = request.cookies.get(COOKIE_NAME)?.value;
  if (!value) return null;

  const parts = value.split(".");
  if (parts.length === 3) {
    const [ballotId, issuedAtRaw, receivedSignature] = parts;
    if (!ballotId || !issuedAtRaw || !receivedSignature) return null;
    if (!UUID_PATTERN.test(ballotId) || !/^\d{1,12}$/.test(issuedAtRaw)) {
      return null;
    }
    const issuedAt = Number(issuedAtRaw);
    const ageSeconds = Math.floor(Date.now() / 1000) - issuedAt;
    if (ageSeconds < 0 || ageSeconds > BALLOT_MAX_AGE_SECONDS) return null;
    return signatureMatches(`${ballotId}.${issuedAtRaw}`, receivedSignature)
      ? ballotId
      : null;
  }

  if (parts.length === 2) {
    const [ballotId, receivedSignature] = parts;
    if (!ballotId || !receivedSignature || !UUID_PATTERN.test(ballotId))
      return null;
    return signatureMatches(ballotId, receivedSignature) ? ballotId : null;
  }

  return null;
}

export function newAwardsBallot() {
  const ballotId = randomUUID();
  const issuedAt = String(Math.floor(Date.now() / 1000));
  const payload = `${ballotId}.${issuedAt}`;
  return { ballotId, value: `${payload}.${signAwardsValue(payload)}` };
}

export const awardsBallotCookie = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    maxAge: BALLOT_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  },
};

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "breakpoint_awards_ballot";
const UUID_PATTERN =
  /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;

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

function signature(ballotId: string) {
  return createHmac("sha256", secret()).update(ballotId).digest("base64url");
}

export function readAwardsBallot(request: NextRequest) {
  const value = request.cookies.get(COOKIE_NAME)?.value;
  if (!value) return null;

  const [ballotId, receivedSignature] = value.split(".");
  if (!ballotId || !receivedSignature || !UUID_PATTERN.test(ballotId))
    return null;

  const expectedSignature = signature(ballotId);
  const received = Buffer.from(receivedSignature);
  const expected = Buffer.from(expectedSignature);
  if (
    received.length !== expected.length ||
    !timingSafeEqual(received, expected)
  ) {
    return null;
  }
  return ballotId;
}

export function newAwardsBallot() {
  const ballotId = randomUUID();
  return { ballotId, value: `${ballotId}.${signature(ballotId)}` };
}

export const awardsBallotCookie = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 120,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  },
};

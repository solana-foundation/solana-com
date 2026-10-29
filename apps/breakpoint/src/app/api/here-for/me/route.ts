import { NextRequest, NextResponse } from "next/server";
import {
  awardsBallotCookie,
  newAwardsBallot,
  readAwardsBallot,
} from "@/lib/awards-session";
import { loadPersonalGraph, loadMeByBallot } from "@/lib/here-for/data";
import { hereForStatus, mePayload } from "@/lib/here-for/payload";
import { readXSession } from "@/lib/here-for/x-auth";
import type { HereForHandle } from "@/lib/here-for/types";
export const runtime = "nodejs";
export async function GET(request: NextRequest) {
  try {
    const current = readAwardsBallot(request);
    const cookie = current ? null : newAwardsBallot();
    const ballotId = current ?? cookie!.ballotId;
    const x = readXSession(request);
    const person = !x && current ? await loadMeByBallot(ballotId) : null;
    const handle =
      x?.handle ?? (person?.handle as HereForHandle | null) ?? null;
    const rows = handle
      ? await loadPersonalGraph(handle)
      : { people: [], adds: [] };
    const response = NextResponse.json(
      mePayload(rows, handle, hereForStatus(), x?.handle ?? null),
      { headers: { "Cache-Control": "no-store" } },
    );
    if (cookie)
      response.cookies.set(
        awardsBallotCookie.name,
        cookie.value,
        awardsBallotCookie.options,
      );
    return response;
  } catch {
    return NextResponse.json(
      { error: "Profile unavailable.", code: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

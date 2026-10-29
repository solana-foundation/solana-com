import { checkBotId } from "botid/server";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import {
  clientCountry,
  clientIp,
  enforceSubmissionRateLimit,
  hasSameOrigin,
  hashIp,
} from "@/lib/awards-abuse";
import { readAwardsBallot } from "@/lib/awards-session";
import {
  HandleClaimedError,
  loadCardAdds,
  loadPersonalGraph,
  submitAdds,
} from "@/lib/here-for/data";
import { validateAdds } from "@/lib/here-for/handles";
import { hereForStatus, mePayload } from "@/lib/here-for/payload";
import { readXSession } from "@/lib/here-for/x-auth";
import type { HereForErrorCode, HereForHandle } from "@/lib/here-for/types";
export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store" };
const MAX_BODY_BYTES = 2048;
function failure(
  status: number,
  code: HereForErrorCode,
  reason: string,
  cause?: unknown,
) {
  const entry = {
    event: "here_for_adds_failure",
    method: "POST",
    status,
    reason,
    ...(status < 500 ? { sampleRate: 0.01 } : {}),
    ...(cause
      ? {
          errorName: cause instanceof Error ? cause.name : typeof cause,
          errorCode:
            typeof cause === "object" && cause !== null && "code" in cause
              ? String(cause.code)
              : null,
        }
      : {}),
  };
  if (status >= 500) console.error(JSON.stringify(entry));
  else if (Math.random() < 0.01) console.log(JSON.stringify(entry));
  return NextResponse.json(
    { error: reason, code },
    {
      status,
      headers: {
        ...headers,
        ...(status === 429 ? { "Retry-After": "60" } : {}),
      },
    },
  );
}
async function readBody(request: NextRequest) {
  if (!request.body) throw new SyntaxError();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RangeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(body)) as unknown;
}
export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request))
    return failure(403, "unavailable", "origin_rejected");
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return failure(415, "invalid_adds", "invalid_content_type");
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > MAX_BODY_BYTES)
    return failure(413, "invalid_adds", "body_too_large");
  let ballotId: string | null;
  try {
    ballotId = readAwardsBallot(request);
  } catch (error) {
    return failure(503, "unavailable", "ballot_validation_failed", error);
  }
  if (!ballotId) return failure(400, "unavailable", "ballot_missing");
  let x;
  try {
    x = await readXSession(request);
  } catch (error) {
    return failure(503, "unavailable", "session_validation_failed", error);
  }
  if (!x) return failure(401, "auth_required", "x_session_missing");
  try {
    if (hereForStatus() === "closed") return failure(403, "closed", "closed");
    if (await enforceSubmissionRateLimit(request))
      return failure(429, "rate_limited", "rate_limited");
    if ((await checkBotId()).isBot)
      return failure(403, "unavailable", "bot_rejected");
  } catch (error) {
    return failure(503, "unavailable", "verification_failed", error);
  }
  let body: unknown;
  try {
    body = await readBody(request);
  } catch (error) {
    return failure(
      error instanceof RangeError ? 413 : 400,
      "invalid_adds",
      error instanceof RangeError ? "body_too_large" : "invalid_json",
    );
  }
  if (!body || typeof body !== "object" || Array.isArray(body))
    return failure(400, "invalid_adds", "invalid_json_shape");
  const input = body as Record<string, unknown>;
  const handle = x.handle;
  const validated = validateAdds(handle, input.adds);
  if ("code" in validated)
    return failure(400, validated.code!, validated.code!);
  try {
    const before = await loadCardAdds(handle);
    const beforeMutual = new Set(
      (before ?? []).filter((add) => add.mutual).map((add) => add.handle),
    );
    await submitAdds(
      ballotId,
      handle,
      validated.adds!,
      hashIp(clientIp(request)),
      clientCountry(request),
    );
    const rows = await loadPersonalGraph(handle);
    const me = mePayload(rows, handle, hereForStatus(), handle);
    return NextResponse.json(
      {
        me,
        newMutuals: me.mutuals.filter(
          (h: HereForHandle) => !beforeMutual.has(h),
        ),
      },
      { headers },
    );
  } catch (error) {
    if (
      error instanceof HandleClaimedError ||
      (error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002")
    )
      return failure(409, "handle_claimed", "handle_claimed");
    return failure(503, "unavailable", "save_failed", error);
  }
}

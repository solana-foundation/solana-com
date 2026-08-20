import { randomUUID } from "node:crypto";
import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";

import {
  appendUniversityAmbassadorApplication,
  UniversityAmbassadorSheetsConfigurationError,
} from "@/lib/university-ambassador/google-sheets";
import {
  normalizeAmbassadorApplication,
  validateAmbassadorApplication,
} from "@/lib/university-ambassador/validation";
import {
  checkUniversityAmbassadorRateLimit,
  clientIpFromHeaders,
} from "@/lib/university-ambassador/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 15;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
} as const;

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  if (!isRecord(body)) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const values = normalizeAmbassadorApplication(body);
  const fieldErrors = validateAmbassadorApplication(values);

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields and try again.",
        fieldErrors,
      },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  if (body.website) {
    // Hidden honeypot: real applicants never see or fill this field.
    return NextResponse.json({ ok: true }, { headers: NO_STORE_HEADERS });
  }

  const clientIp = clientIpFromHeaders(request.headers);
  const rateLimit = checkUniversityAmbassadorRateLimit({ ip: clientIp });

  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: rateLimit.error },
      {
        status: 429,
        headers: {
          ...NO_STORE_HEADERS,
          "Retry-After": String(rateLimit.retryAfter),
        },
      },
    );
  }

  const locale =
    typeof body.locale === "string" ? body.locale.slice(0, 16) : "en";
  const submissionId = randomUUID();

  try {
    const botCheck = await checkBotId();

    if (botCheck.isBot) {
      return NextResponse.json(
        { error: "We could not verify this submission." },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    try {
      await appendUniversityAmbassadorApplication(
        values,
        { locale, submissionId },
        controller.signal,
      );
    } finally {
      clearTimeout(timeout);
    }

    return NextResponse.json({ ok: true }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("University ambassador submission request failed", error);

    return NextResponse.json(
      {
        error:
          error instanceof UniversityAmbassadorSheetsConfigurationError
            ? "The application form is not configured yet."
            : "We could not submit your application. Please try again.",
      },
      {
        status:
          error instanceof UniversityAmbassadorSheetsConfigurationError
            ? 503
            : 502,
        headers: NO_STORE_HEADERS,
      },
    );
  } finally {
    rateLimit.release();
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

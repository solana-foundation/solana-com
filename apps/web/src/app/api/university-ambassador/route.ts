import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import {
  appendUniversityAmbassadorApplication,
  UniversityAmbassadorSheetsConfigurationError,
} from "@/lib/university-ambassador/google-sheets";
import {
  normalizeAmbassadorApplication,
  validateAmbassadorApplication,
} from "@/lib/university-ambassador/validation";

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

  const locale =
    typeof body.locale === "string" ? body.locale.slice(0, 16) : "en";
  const submissionId = randomUUID();

  try {
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
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

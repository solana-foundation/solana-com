import { randomUUID } from "node:crypto";
import { checkBotId } from "botid/server";
import { checkRateLimit } from "@vercel/firewall";
import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";

import { resolveLocale } from "@workspace/i18n/messages";
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

const ERROR_TRANSLATION_NAMESPACE =
  "universities.application.form.serverErrors";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
} as const;
const UNIVERSITY_AMBASSADOR_RATE_LIMIT_ID = "university-ambassador-submit";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    const t = await getErrorTranslations();

    return NextResponse.json(
      { error: t("invalidRequest") },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  if (!isRecord(body)) {
    const t = await getErrorTranslations();

    return NextResponse.json(
      { error: t("invalidRequest") },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const locale = resolveLocale(
    typeof body.locale === "string" ? body.locale : undefined,
  );
  const t = await getErrorTranslations(locale);

  const values = normalizeAmbassadorApplication(body);
  const fieldErrors = validateAmbassadorApplication(values);

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      {
        error: t("validation"),
        fieldErrors,
      },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  if (body.website) {
    // Hidden honeypot: real applicants never see or fill this field.
    return NextResponse.json({ ok: true }, { headers: NO_STORE_HEADERS });
  }

  let rateLimit: Awaited<ReturnType<typeof checkRateLimit>>;

  try {
    rateLimit = await checkRateLimit(UNIVERSITY_AMBASSADOR_RATE_LIMIT_ID, {
      request,
    });
  } catch (error) {
    console.error("University ambassador rate-limit check failed", error);

    return NextResponse.json(
      { error: t("unavailable") },
      {
        status: 503,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  if (
    rateLimit.error === "not-found" &&
    process.env.NODE_ENV === "production"
  ) {
    console.error(
      `University Ambassador Vercel WAF rate limit '${UNIVERSITY_AMBASSADOR_RATE_LIMIT_ID}' is not configured`,
    );

    return NextResponse.json(
      { error: t("notConfigured") },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  if (rateLimit.rateLimited) {
    return NextResponse.json(
      { error: t("rateLimited") },
      {
        status: 429,
        headers: {
          ...NO_STORE_HEADERS,
          "Retry-After": "60",
        },
      },
    );
  }

  const submissionId = randomUUID();

  try {
    const botCheck = await checkBotId();

    if (botCheck.isBot) {
      return NextResponse.json(
        { error: t("verification") },
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
            ? t("notConfigured")
            : t("submission"),
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

async function getErrorTranslations(locale = "en") {
  return getTranslations({
    locale,
    namespace: ERROR_TRANSLATION_NAMESPACE,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

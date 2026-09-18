import { NextResponse } from "next/server";
import { z } from "zod";
import { checkChangelogSubscribeRateLimit } from "@/lib/changelog-subscribe-rate-limit";
import { CHANGELOG_SUBSCRIBE_URL } from "@/lib/changelog";

const subscribeSchema = z.object({
  email: z.email().max(254),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const rateLimit = checkChangelogSubscribeRateLimit({
    headers: request.headers,
    email: parsed.data.email,
  });
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: "Too many subscription attempts" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter) },
      },
    );
  }

  const data = new FormData();
  data.append("email", parsed.data.email);

  try {
    const response = await fetch(CHANGELOG_SUBSCRIBE_URL, {
      method: "POST",
      body: data,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Subscription failed" },
        { status: 502 },
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Subscription failed" }, { status: 502 });
  } finally {
    rateLimit.release();
  }
}

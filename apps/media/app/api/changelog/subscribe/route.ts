import { NextResponse } from "next/server";
import { z } from "zod";
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
  }
}

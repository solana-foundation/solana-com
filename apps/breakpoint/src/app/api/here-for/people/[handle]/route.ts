import { NextResponse } from "next/server";
import { loadPersonalGraph } from "@/lib/here-for/data";
import { normalizeHandle } from "@/lib/here-for/handles";
import { personPayload } from "@/lib/here-for/payload";
export const runtime = "nodejs";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ handle: string }> },
) {
  const handle = normalizeHandle((await params).handle);
  if (!handle)
    return NextResponse.json(
      { error: "Person not found.", code: "invalid_handle" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  try {
    const rows = await loadPersonalGraph(handle);
    const person = personPayload(rows, handle);
    return person
      ? NextResponse.json(person, {
          headers: { "Cache-Control": "public, s-maxage=30" },
        })
      : NextResponse.json(
          { error: "Person not found.", code: "unavailable" },
          { status: 404, headers: { "Cache-Control": "no-store" } },
        );
  } catch {
    return NextResponse.json(
      { error: "People unavailable.", code: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

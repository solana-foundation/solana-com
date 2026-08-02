/**
 * Fire-and-forget feedback endpoint (parity with the docs-agent service
 * contract). The local Claude-backed implementation just acknowledges.
 */
export async function POST() {
  return new Response(null, { status: 204 });
}

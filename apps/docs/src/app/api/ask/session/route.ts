/**
 * Local Ask Solana session endpoint. The ui-chrome client mints a session
 * token before chatting (parity with the docs-agent service contract). For
 * the local Claude-backed dev implementation the token is opaque and
 * unvalidated — conversation state is keyed by conversation_id instead.
 */
export async function POST() {
  return Response.json({ session_token: crypto.randomUUID() });
}

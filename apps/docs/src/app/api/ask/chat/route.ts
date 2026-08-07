import Anthropic from "@anthropic-ai/sdk";

/**
 * Claude-backed Ask Solana chat endpoint. Speaks the exact SSE protocol the
 * ui-chrome client (packages/ui-chrome/src/ask-solana/api.ts) expects —
 * `status` / `delta` / `done` / `error` events — so both the Vector widget
 * and the ⌘K modal chat work against it unchanged.
 *
 * Auth: reads ANTHROPIC_API_KEY (put it in apps/docs/.env.local for local
 * dev — never NEXT_PUBLIC_, the key stays server-side).
 *
 * Conversation state is an in-memory map keyed by conversation_id: fine for
 * local dev and single-instance deploys, resets on restart, not shared
 * across serverless instances.
 */

export const runtime = "nodejs";

const MODEL = "claude-opus-5";

const SYSTEM_PROMPT = `You are Vector, the AI docs assistant for the Solana developer documentation at solana.com/docs.

- Answer questions about Solana development: accounts, transactions, programs, tokens, RPC, wallets, CLI tooling, Anchor, and the JavaScript/Rust SDKs.
- Be concise and practical. Prefer short Markdown answers with one focused code example when it helps.
- Use fenced code blocks with a language tag. Default to TypeScript for client code and Rust for on-chain programs unless asked otherwise.
- If a question is unrelated to Solana, say so briefly and steer back to Solana topics.
- If you are not sure about something, say so rather than guessing.`;

type Conversation = {
  messages: Anthropic.Beta.BetaMessageParam[];
  updatedAt: number;
};

const conversations = new Map<string, Conversation>();
const MAX_CONVERSATIONS = 500;
const MAX_MESSAGES_PER_CONVERSATION = 24;
const CONVERSATION_TTL_MS = 4 * 60 * 60 * 1000;

function saveConversation(
  id: string,
  messages: Anthropic.Beta.BetaMessageParam[],
) {
  const now = Date.now();
  for (const [key, conversation] of conversations) {
    if (now - conversation.updatedAt > CONVERSATION_TTL_MS) {
      conversations.delete(key);
    }
  }
  // Re-insert so Map order approximates least-recently-used.
  conversations.delete(id);
  conversations.set(id, {
    messages: messages.slice(-MAX_MESSAGES_PER_CONVERSATION),
    updatedAt: now,
  });
  while (conversations.size > MAX_CONVERSATIONS) {
    const oldest = conversations.keys().next().value;
    if (!oldest) break;
    conversations.delete(oldest);
  }
}

export async function POST(req: Request) {
  let body: { message?: unknown; conversation_id?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return Response.json({ error: "message is required" }, { status: 400 });
  }

  const requestedId =
    typeof body.conversation_id === "string" ? body.conversation_id : null;
  const conversationId =
    requestedId && conversations.has(requestedId)
      ? requestedId
      : crypto.randomUUID();
  const history = conversations.get(conversationId)?.messages ?? [];
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    ...history,
    { role: "user", content: message },
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const send = (event: string, data: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(
            encoder.encode(
              `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
            ),
          );
        } catch {
          closed = true; // client went away mid-write
        }
      };

      try {
        if (!process.env.ANTHROPIC_API_KEY) {
          console.error(
            "[ask/chat] ANTHROPIC_API_KEY is not set. Add it to apps/docs/.env.local and restart `pnpm dev`.",
          );
          send("error", { message: "missing_api_key" });
          return;
        }

        const client = new Anthropic();
        send("status", { stage: "thinking" });

        // Thinking is on by default on claude-opus-5 (adaptive); the
        // server-side fallback re-runs safety-classifier declines on
        // Anthropic's recommended substitute model.
        const runner = client.beta.messages.stream(
          {
            model: MODEL,
            max_tokens: 16000,
            system: SYSTEM_PROMPT,
            messages,
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
          },
          { signal: req.signal },
        );

        runner.on("text", (text) => send("delta", { text }));

        const final = await runner.finalMessage();

        if (final.stop_reason === "refusal") {
          // Whole fallback chain declined — surface as an error.
          send("error", { message: "refusal" });
          return;
        }

        // Echo full content blocks (including thinking) back on later turns,
        // per the multi-turn contract for thinking models.
        saveConversation(conversationId, [
          ...messages,
          { role: "assistant", content: final.content },
        ]);

        send("done", {
          run_id: final.id,
          conversation_id: conversationId,
          citations: [],
        });
      } catch (error) {
        if (req.signal.aborted) return;
        if (error instanceof Anthropic.RateLimitError) {
          send("error", { message: "rate_limited" });
        } else if (error instanceof Anthropic.AuthenticationError) {
          console.error(
            "[ask/chat] ANTHROPIC_API_KEY was rejected (401). Check the key in apps/docs/.env.local.",
          );
          send("error", { message: "invalid_api_key" });
        } else if (error instanceof Anthropic.APIConnectionError) {
          console.error(
            "[ask/chat] connection to the Claude API failed:",
            error,
          );
          send("error", { message: "upstream_unreachable" });
        } else if (error instanceof Anthropic.APIError) {
          console.error(
            `[ask/chat] Claude API error ${error.status}:`,
            error.message,
          );
          send("error", { message: "upstream_error" });
        } else {
          console.error("[ask/chat] unexpected error:", error);
          send("error", { message: "unexpected_error" });
        }
      } finally {
        if (!closed) {
          try {
            controller.close();
          } catch {
            // already closed by the runtime
          }
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}

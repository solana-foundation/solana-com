/**
 * Anonymous conversation id for the Vector widget. Memory first so it
 * survives remounts and route changes; mirrored to sessionStorage so a reload
 * keeps the thread. Only the opaque id is stored, never message text.
 */
const CONVERSATION_STORAGE_KEY = "ask-solana:conversation";

let memoryConversationId: string | null = null;

function storage(): Storage | null {
  try {
    return typeof window === "undefined"
      ? null
      : (window.sessionStorage ?? null);
  } catch {
    return null;
  }
}

export function getStoredConversationId(): string | null {
  if (memoryConversationId) return memoryConversationId;
  try {
    const stored = storage()?.getItem(CONVERSATION_STORAGE_KEY);
    if (stored) memoryConversationId = stored;
  } catch {
    // Storage blocked: memory only.
  }
  return memoryConversationId;
}

export function storeConversationId(id: string | null) {
  memoryConversationId = id;
  try {
    const store = storage();
    if (!store) return;
    if (id) store.setItem(CONVERSATION_STORAGE_KEY, id);
    else store.removeItem(CONVERSATION_STORAGE_KEY);
  } catch {
    // Storage blocked: memory only.
  }
}

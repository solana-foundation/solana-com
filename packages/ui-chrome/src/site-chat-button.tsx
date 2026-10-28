"use client";

import { usePathname } from "@workspace/i18n/routing";
import { AskSolanaButton } from "./ask-solana/ask-solana-button";
import { InkeepChatButton } from "./inkeep-chat-button";
import { isAskSolanaRoute } from "./developer-routes";

/** Ask Solana on /docs, Inkeep everywhere else. */
export function SiteChatButton() {
  const pathname = usePathname();
  return isAskSolanaRoute(pathname) ? (
    <AskSolanaButton />
  ) : (
    <InkeepChatButton />
  );
}

"use client";

import { InkeepModalSearchAndChat } from "@inkeep/cxkit-react";
import type {
  InkeepEmbeddedSearchAndChatFunctions,
  InkeepModalSearchAndChatProps,
} from "@inkeep/cxkit-react";
import type { RefObject } from "react";

// next/dynamic owns its component ref. Pass the widget handle as a regular prop
// so opening a different entry point can change views without losing the chat.
export function InkeepModal({
  functionsRef,
  ...props
}: Omit<InkeepModalSearchAndChatProps, "ref"> & {
  functionsRef: RefObject<InkeepEmbeddedSearchAndChatFunctions>;
}) {
  return <InkeepModalSearchAndChat {...props} ref={functionsRef} />;
}

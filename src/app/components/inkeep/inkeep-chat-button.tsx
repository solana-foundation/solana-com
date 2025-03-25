"use client";

import { InkeepChatButton as ChatButton } from "@inkeep/cxkit-react";
import { useInkeepConfig } from "./useInkeepConfig";

export function InkeepChatButton() {
  const inkeepConfig = useInkeepConfig();

  return <ChatButton {...inkeepConfig} />;
}

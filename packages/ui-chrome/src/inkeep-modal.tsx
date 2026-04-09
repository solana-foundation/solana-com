"use client";

import dynamic from "next/dynamic";
import { useInkeepConfig } from "./inkeep-config";

const InkeepModalSearchAndChat = dynamic(
  () =>
    import("@inkeep/cxkit-react").then((mod) => mod.InkeepModalSearchAndChat),
  {
    ssr: false,
  },
);

export function InkeepModal() {
  const inkeepConfig = useInkeepConfig();

  if (!inkeepConfig.shouldRenderModal) {
    return null;
  }

  return (
    <InkeepModalSearchAndChat
      defaultView={inkeepConfig.shouldForceSearchView ? "search" : "chat"}
      forceDefaultView={inkeepConfig.shouldForceSearchView}
      baseSettings={inkeepConfig.baseSettings}
      searchSettings={inkeepConfig.searchSettings}
      aiChatSettings={inkeepConfig.aiChatSettings}
      modalSettings={{
        isOpen: inkeepConfig.modalSettings.isOpen,
        onOpenChange: inkeepConfig.modalSettings.onOpenChange,
        shortcutKey: "k",
      }}
    />
  );
}

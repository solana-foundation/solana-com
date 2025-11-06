"use client";

import dynamic from "next/dynamic";
import { useInkeepConfig } from "./inkeep-config";
import { useTranslations } from "next-intl";
import SolanaIcon from "@@/public/src/img/icons/solana.inline.svg";

const InkeepModalSearchAndChat = dynamic(
  () =>
    import("@inkeep/cxkit-react").then((mod) => mod.InkeepModalSearchAndChat),
  {
    ssr: false,
  },
);

export function InkeepChatButton() {
  const inkeepConfig = useInkeepConfig();
  const t = useTranslations();

  return (
    <>
      <button
        className="fixed bottom-8 right-8 z-10 h-[44px] px-[20px] justify-center items-center gap-[8px] rounded-full !bg-gradient-to-b from-black to-[#14001D] shadow-[0_-4px_12px_0_#361B40_inset,0_1px_0_0_#C37CE0_inset,0_-1px_0_0_#D06BF8_inset] backdrop-blur-[3px] text-white font-brand text-[14px] md:text-[16px] leading-[1.42] md:leading-[1.5] tracking-[-0.14px] md:tracking-[-0.16px] max-md:hidden flex"
        onClick={() => inkeepConfig.modalSettings.onOpenChange(true)}
        type="button"
      >
        <SolanaIcon className="size-4" />
        <span>{t("commands.askAI")}</span>
      </button>

      <InkeepModalSearchAndChat
        defaultView="chat"
        baseSettings={inkeepConfig.baseSettings}
        searchSettings={inkeepConfig.searchSettings}
        aiChatSettings={inkeepConfig.aiChatSettings}
        modalSettings={{
          isOpen: inkeepConfig.modalSettings.isOpen,
          onOpenChange: inkeepConfig.modalSettings.onOpenChange,
          shortcutKey: "k",
        }}
      />
    </>
  );
}

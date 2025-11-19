"use client";

import dynamic from "next/dynamic";
import { useInkeepConfig } from "./inkeep-config";
import { useTranslations } from "next-intl";
import { useId } from "react";

const InkeepModalSearchAndChat = dynamic(
  () =>
    import("@inkeep/cxkit-react").then((mod) => mod.InkeepModalSearchAndChat),
  {
    ssr: false,
  },
);

const SolanaIcon = ({ className }: { className?: string }) => {
  const id = useId();
  return (
    <svg
      className={className}
      width="16"
      height="14"
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.9162 11.0381L13.2749 13.809C13.2178 13.8692 13.1486 13.9172 13.0716 13.95C12.9947 13.9829 12.9117 13.9999 12.8277 14H0.306886C0.247168 14 0.188756 13.9829 0.138801 13.9509C0.0888472 13.9189 0.0495192 13.8733 0.0256329 13.8197C0.00174657 13.7662 -0.00566129 13.707 0.00431634 13.6494C0.014294 13.5918 0.0412241 13.5383 0.0818091 13.4954L2.72013 10.7246C2.77725 10.6644 2.84644 10.6164 2.92338 10.5835C3.00031 10.5507 3.08335 10.5336 3.1673 10.5336H15.6881C15.7484 10.5323 15.8077 10.5486 15.8585 10.5803C15.9094 10.6119 15.9495 10.6576 15.9739 10.7115C15.9983 10.7655 16.0058 10.8253 15.9955 10.8834C15.9853 10.9415 15.9577 10.9953 15.9162 11.0381ZM13.2749 5.45712C13.2175 5.39721 13.1483 5.34937 13.0714 5.31652C12.9945 5.28368 12.9116 5.26651 12.8277 5.26608H0.306886C0.247168 5.26611 0.188756 5.28318 0.138801 5.3152C0.0888472 5.34721 0.0495192 5.39279 0.0256329 5.44633C0.00174657 5.49988 -0.00566129 5.55908 0.00431634 5.61669C0.014294 5.67429 0.0412241 5.7278 0.0818091 5.77066L2.72013 8.54294C2.77747 8.60285 2.84671 8.65069 2.92359 8.68354C3.00048 8.71639 3.0834 8.73355 3.1673 8.73398H15.6881C15.7477 8.73367 15.8059 8.71639 15.8557 8.68427C15.9054 8.65214 15.9445 8.60655 15.9682 8.55306C15.9919 8.49957 15.9992 8.44049 15.9891 8.38302C15.9791 8.32554 15.9522 8.27217 15.9117 8.2294L13.2749 5.45712ZM0.306886 3.46651H12.8277C12.9117 3.46644 12.9947 3.44944 13.0716 3.41657C13.1486 3.3837 13.2178 3.33566 13.2749 3.27547L15.9162 0.504645C15.9471 0.472622 15.9705 0.434302 15.9846 0.392425C15.9986 0.350548 16.0031 0.306148 15.9975 0.262399C15.992 0.21865 15.9767 0.176632 15.9527 0.13935C15.9286 0.102067 15.8965 0.0704405 15.8585 0.0467307C15.8076 0.0150784 15.7484 -0.00115781 15.6881 6.42451e-05H3.1673C3.08335 0.000150701 3.00031 0.0171585 2.92338 0.0500271C2.84644 0.0828956 2.77725 0.13092 2.72013 0.191105L0.0818091 2.96193C0.0412241 3.00479 0.014294 3.05829 0.00431634 3.1159C-0.00566129 3.1735 0.00174657 3.2327 0.0256329 3.28625C0.0495192 3.3398 0.0888472 3.38537 0.138801 3.41739C0.188756 3.4494 0.247168 3.46647 0.306886 3.46651Z"
        fill={`url(#${id})`}
      />
      <defs>
        <linearGradient
          id={id}
          x1="1.35029"
          y1="14.334"
          x2="14.1587"
          y2="-0.425393"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.08" stopColor="#9945FF" />
          <stop offset="0.3" stopColor="#8752F3" />
          <stop offset="0.5" stopColor="#5497D5" />
          <stop offset="0.6" stopColor="#43B4CA" />
          <stop offset="0.72" stopColor="#28E0B9" />
          <stop offset="0.97" stopColor="#14F195" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const BUTTON_CLASSNAME = {
  fixed: " fixed bottom-8 right-8 z-10 max-md:hidden",
  inline: " ",
};

interface InkeepChatButtonProps {
  className?: string;
  variant?: "fixed" | "inline";
}

export function InkeepChatButton({
  className,
  variant = "fixed",
}: InkeepChatButtonProps) {
  const inkeepConfig = useInkeepConfig();
  const t = useTranslations();

  return (
    <>
      <button
        className={
          className +
          BUTTON_CLASSNAME[variant] +
          " h-[36px] md:h-[44px] px-[16px] md:px-[20px] justify-center items-center gap-[8px] rounded-full !bg-gradient-to-b from-black to-[#14001D] hover:from-black hover:to-[#2A013C] shadow-[0_-4px_12px_0_#361B40_inset,0_1px_0_0_#C37CE0_inset,0_-1px_0_0_#D06BF8_inset] hover:shadow-[0_-4px_12px_0_#482654_inset,0_1px_0_0_#E2B6F4_inset,0_-1px_0_0_#EEBAFF_inset] backdrop-blur-[3px] text-white font-brand text-[14px] md:text-[16px] leading-[1.42] md:leading-[1.5] tracking-[-0.14px] md:tracking-[-0.16px] flex hover:backdrop-blur-[3px]"
        }
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

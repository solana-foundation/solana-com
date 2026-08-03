"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AskSolanaModalHost } from "./modal";
import { AskSolanaWidget } from "./ask-solana-widget";
import { trackAskSolana } from "./analytics";

/**
 * "Vector" — miniature of the animated robot mark (design component 1a,
 * Solana.com Design System). CSS clip-paths and gradients only, no SVG;
 * all motion collapses under prefers-reduced-motion.
 */
const RobotIcon = () => (
  <span className="askai-bot" aria-hidden="true">
    <style>{`
      .askai-bot{position:relative;display:inline-flex;flex-direction:column;align-items:center;justify-content:flex-end;width:54px;height:66px;flex-shrink:0;animation:askai-float 3.6s ease-in-out infinite alternate}
      .askai-bot-tip{width:15px;height:15px;background:#14F195;transform:rotate(45deg);animation:askai-pulse 2.4s ease-in-out infinite}
      .askai-bot-stalk{width:3px;height:9px;margin-top:-2px;background:#9945FF}
      .askai-bot-head{position:relative;width:54px;height:39px;clip-path:polygon(14% 0,86% 0,100% 22%,100% 78%,86% 100%,14% 100%,0 78%,0 22%);background:rgba(255,255,255,.25)}
      .askai-bot-headin{position:absolute;inset:1px;clip-path:polygon(14% 0,86% 0,100% 22%,100% 78%,86% 100%,14% 100%,0 78%,0 22%);background:linear-gradient(165deg,#1a0f2e,#0a0712 60%,#050507);display:flex;align-items:center;justify-content:center}
      .askai-bot-face{display:flex;align-items:center;justify-content:center;gap:5px;width:36px;height:18px;background:#050507;border:1px solid rgba(153,69,255,.6);border-radius:5px}
      .askai-bot-eye{width:9px;height:6px;border-radius:1px;background:linear-gradient(90deg,#9945FF,#14F195);box-shadow:0 0 6px rgba(20,241,149,.5);transform:skewX(-16deg);animation:askai-blink 4s infinite}
      .askai-bot-eye+.askai-bot-eye{animation-delay:.12s}
      .askai-bot-vent{position:absolute;bottom:5px;width:6px;height:2px;border-radius:1px;opacity:.85}
      .askai-bot-vent-l{left:8px;background:#9945FF}
      .askai-bot-vent-r{right:8px;background:#14F195}
      @keyframes askai-float{from{transform:translateY(0)}to{transform:translateY(-4px)}}
      @keyframes askai-blink{0%,90%,100%{transform:skewX(-16deg) scaleY(1)}93%{transform:skewX(-16deg) scaleY(.08)}96%{transform:skewX(-16deg) scaleY(1)}}
      @keyframes askai-pulse{0%,100%{opacity:.65;box-shadow:0 0 4px rgba(20,241,149,.4)}50%{opacity:1;box-shadow:0 0 14px rgba(20,241,149,.9)}}
      @media (prefers-reduced-motion:reduce){.askai-bot,.askai-bot *{animation-duration:.01ms!important;animation-iteration-count:1!important}}
    `}</style>
    <span className="askai-bot-tip" />
    <span className="askai-bot-stalk" />
    <span className="askai-bot-head">
      <span className="askai-bot-headin">
        <span className="askai-bot-face">
          <span className="askai-bot-eye" />
          <span className="askai-bot-eye" />
        </span>
        <span className="askai-bot-vent askai-bot-vent-l" />
        <span className="askai-bot-vent askai-bot-vent-r" />
      </span>
    </span>
  </span>
);

const BUTTON_CLASSNAME = {
  fixed: " fixed bottom-8 right-8 z-10 max-md:hidden",
  inline: " ",
};

interface AskSolanaButtonProps {
  className?: string;
  variant?: "fixed" | "inline";
}

/**
 * Entry-point button for the in-house Ask Solana assistant backed by the
 * docs-agent service. Clicking the robot toggles the compact Vector chat
 * widget anchored above it; the full modal stays reachable via ⌘K / the
 * search bar (AskSolanaModalHost).
 */
export function AskSolanaButton({
  className,
  variant = "fixed",
}: AskSolanaButtonProps) {
  const t = useTranslations();
  const [chatOpen, setChatOpen] = React.useState(false);

  const toggleChat = () => {
    const next = !chatOpen;
    if (next) trackAskSolana("docs_ai_chat_opened", { view: "widget" });
    setChatOpen(next);
  };

  return (
    <>
      <button
        className={
          (className ?? "") +
          BUTTON_CLASSNAME[variant] +
          " flex items-center justify-center bg-transparent transition-transform hover:scale-110"
        }
        onClick={toggleChat}
        type="button"
        aria-label={t("commands.askAI")}
        aria-expanded={chatOpen}
        aria-haspopup="dialog"
      >
        <RobotIcon />
      </button>

      <AskSolanaWidget open={chatOpen} onClose={() => setChatOpen(false)} />

      <AskSolanaModalHost />
    </>
  );
}

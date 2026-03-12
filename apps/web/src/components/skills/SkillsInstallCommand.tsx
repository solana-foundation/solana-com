"use client";

import { useState } from "react";
import CopyIcon from "@@/public/src/img/icons/Copy.inline.svg";
import CopyConfirmIcon from "@@/public/src/img/icons/CopyConfirm.inline.svg";
import { SOLANA_DEV_SKILLS_REPO_URL } from "./skills";

const COMMAND = `npx skills add ${SOLANA_DEV_SKILLS_REPO_URL}`;

export function SkillsInstallCommand({ copyLabel }: { copyLabel: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const CopyIconToUse = copied ? CopyConfirmIcon : CopyIcon;

  return (
    <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm w-fit max-w-full">
      <span className="text-green-400 select-none">$</span>
      <span className="text-white/80 truncate">{COMMAND}</span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copyLabel}
        className="ml-1 shrink-0 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
      >
        <CopyIconToUse width={16} height={16} strokeWidth={1.5} />
      </button>
    </div>
  );
}

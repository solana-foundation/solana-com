"use client";

import { User, Terminal } from "lucide-react";

export function SkillsAudienceToggle() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center rounded-full border border-white/15 w-fit font-mono text-xs">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/40 text-white">
          <User size={12} />
          Human
        </span>
        <a
          href="/SKILL.md"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/40 hover:text-white/60 hover:bg-white/5 transition-colors"
        >
          <Terminal size={12} />
          Agent
        </a>
      </div>
    </div>
  );
}

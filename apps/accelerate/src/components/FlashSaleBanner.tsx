"use client";

import { LumaModal } from "./LumaModal";

const LUMA_EVENT_ID = "breakpoint2026";

export function FlashSaleBanner() {
  return (
    <LumaModal lumaId={LUMA_EVENT_ID}>
      <button
        type="button"
        className="group relative flex h-10 min-h-[40px] w-full flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden px-4 text-center font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-accelerate-purple"
        style={{
          background:
            "linear-gradient(90deg, #9945FF 0%, #2A88DE 25%, #9945FF 50%, #19FB9B 75%, #9945FF 100%)",
          backgroundSize: "200% 100%",
          animation: "flash-banner-gradient 8s linear infinite",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
            animation: "flash-banner-shimmer 4s ease-in-out infinite",
          }}
        />

        <span className="relative z-10 text-sm tracking-wide md:text-base">
          Tickets on sale for Breakpoint 2026
          <span className="mx-2 inline-block h-1 w-1 rounded-full bg-white/50 align-middle" />
          <span className="underline decoration-white/70 underline-offset-[3px] transition-all group-hover:decoration-white group-hover:underline-offset-4">
            Get yours now
          </span>
          <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5">
            &rarr;
          </span>
        </span>
      </button>
    </LumaModal>
  );
}

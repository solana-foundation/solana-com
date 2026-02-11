"use client";

import { LumaModal } from "./LumaModal";

const LUMA_EVENT_ID = "breakpoint2026";

export function FlashSaleBanner() {
  return (
    <LumaModal lumaId={LUMA_EVENT_ID}>
      <button
        type="button"
        className="flex h-10 min-h-[40px] w-full flex-shrink-0 cursor-pointer items-center justify-center bg-accelerate-purple px-4 text-center font-medium text-white transition-opacity hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-accelerate-purple"
      >
        <span className="text-sm md:text-base">
          Tickets on sale for Breakpoint 2026 -{" "}
          <span className="underline decoration-white/80 underline-offset-2">
            Get yours now →
          </span>
        </span>
      </button>
    </LumaModal>
  );
}

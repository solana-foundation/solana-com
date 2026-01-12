"use client";

import { usePathname } from "next/navigation";

interface DraftModeIndicatorProps {
  isEnabled: boolean;
}

/**
 * Draft Mode Indicator
 *
 * Shows a banner when draft/preview mode is enabled.
 * Provides a way to exit preview mode.
 */
export function DraftModeIndicator({ isEnabled }: DraftModeIndicatorProps) {
  const pathname = usePathname();

  if (!isEnabled) {
    return null;
  }

  const exitUrl = `/api/draft/disable?redirect=${encodeURIComponent(pathname)}`;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-400 shadow-lg backdrop-blur-sm">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
        </span>
        <span className="font-medium">Preview Mode</span>
        <a
          href={exitUrl}
          className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500/30"
        >
          Exit Preview
        </a>
      </div>
    </div>
  );
}

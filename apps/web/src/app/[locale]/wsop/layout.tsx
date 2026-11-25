import type { ReactNode } from "react";
import { Anton } from "next/font/google";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--wsop-display",
  display: "swap",
});

export default function WsopLayout({ children }: { children: ReactNode }) {
  return (
    /* Paradise accent replaces the Vegas green */
    <div
      className={`[--wsop-bg:#000] [--wsop-card:#0d0c11] [--wsop-text:#fff] [--wsop-muted:#ababba] [--wsop-border:rgba(236,228,253,0.12)] [--wsop-border-prominent:rgba(236,228,253,0.2)] [--wsop-lavender:#ca9ff5] [--wsop-red:#d90029] [--wsop-red-bright:#ff5470] [--wsop-cream:#f6f1e6] [--wsop-font-sans:Diatype,sans-serif] [--wsop-font-label:DSemi,monospace] [--wsop-label-size:0.75rem] md:[--wsop-label-size:0.875rem] [--wsop-label-tracking:0.08em] [--wsop-accent:#7fd8f0] overflow-clip bg-[var(--wsop-bg)] font-[var(--wsop-font-sans)] text-[var(--wsop-text)] selection:bg-[var(--wsop-lavender)] selection:text-black ${anton.variable}`}
    >
      {children}
    </div>
  );
}

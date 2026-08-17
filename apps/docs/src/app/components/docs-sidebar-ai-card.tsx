"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/docs/ai-assistant", label: "AI Assistant", exact: true },
  {
    href: "/docs/intro/coding-with-agents",
    label: "AI Development Setup",
  },
  { href: "/docs/tools/ai", label: "Solana AI Skills" },
];

/* Strip an optional locale prefix (/de/docs, /pt-BR/docs…) so hrefs compare
   against the same base the links use. */
function normalize(pathname: string) {
  return pathname.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/)/, "");
}

const OCTAGON =
  "polygon(14% 0, 86% 0, 100% 22%, 100% 78%, 86% 100%, 14% 100%, 0 78%, 0 22%)";

/* Mini version of Vector's head (the VectorAvatar mark): an octagonal screen
   with two gradient eyes, built from CSS only. */
function VectorHeadIcon() {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "relative",
        width: 16,
        height: 16,
        flexShrink: 0,
        clipPath: OCTAGON,
        background: "rgba(140, 140, 160, 0.5)",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 1,
          clipPath: OCTAGON,
          background: "linear-gradient(158deg, #20202c, #0f0f16)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2.5,
        }}
      >
        {[0, 1].map((i) => (
          <span
            key={i}
            style={{
              width: 3,
              height: 2.5,
              borderRadius: 0.5,
              background: "linear-gradient(135deg, #9945ff, #14f195)",
              transform: "skewX(-16deg)",
            }}
          />
        ))}
      </span>
    </span>
  );
}

/**
 * "SOLANA AI" card pinned under the page tree in the docs sidebar: the
 * Vector landing page plus the agent-setup and skills docs, boxed so the AI
 * entry points read as one group distinct from the reference tree above.
 */
export function DocsSidebarAiCard() {
  const pathname = normalize(usePathname());

  return (
    <div className="mt-4 border-t border-fd-border pt-4">
      <div className="rounded-xl border border-fd-border bg-fd-secondary/50 p-3">
        <span className="flex items-center gap-2 px-2 pb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fd-muted-foreground">
          <VectorHeadIcon />
          Solana AI
        </span>
        <nav className="flex flex-col gap-0.5 pl-4">
          {ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href || pathname === `${item.href}/`
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-2 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-fd-primary/10 font-medium text-fd-primary"
                    : "text-fd-foreground/80 hover:bg-fd-accent hover:text-fd-accent-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

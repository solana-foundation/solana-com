/** @jsxImportSource preact */
import { useEffect, useRef, useState } from "preact/hooks";
import type { MenuData, FabMenuConfig } from "./types";
import { setupDialogBehavior } from "./dialog";
import { SolanaMonoIcon } from "./icons/solana-mono";
import { ArrowUpRightIcon } from "./icons/arrow-up-right";
import { BankIcon } from "./icons/bank";
import { AvatarIcon } from "./icons/avatar";
import { CodeFilledIcon } from "./icons/code-filled";
import { CloseIcon } from "./icons/close";

const ICON_MAP = {
  bank: BankIcon,
  avatar: AvatarIcon,
  code: CodeFilledIcon,
} as const;

interface GetStartedPanelProps {
  data: MenuData;
  config: FabMenuConfig;
  onClose: () => void;
}

export function GetStartedPanel({
  data,
  config,
  onClose,
}: GetStartedPanelProps) {
  const [activeTab, setActiveTab] = useState(data.tabs[0]?.id ?? null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveTab((prev) => prev ?? data.tabs[0]?.id ?? null);
  }, [data.tabs]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    return setupDialogBehavior(el, onClose);
  }, [onClose]);

  const activeLinks = activeTab ? data.links[activeTab] : undefined;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={data.title}
    >
      {/* Overlay */}
      <div class="sfab-overlay" onClick={onClose} />

      {/* Close button */}
      <button
        class="sfab-close"
        onClick={onClose}
        aria-label="Close menu"
        type="button"
      >
        <CloseIcon />
      </button>

      {/* Panel */}
      <div class="sfab-panel">
        <h2 class="sfab-title">
          <SolanaMonoIcon />
          {data.title}
        </h2>

        {/* Tabs */}
        <div class="sfab-tabs" role="tablist">
          {data.tabs.map((tab) => {
            const Icon = ICON_MAP[tab.icon];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                class={`sfab-tab${isActive ? " sfab-tab-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {Icon && <Icon />}
                <span class="sfab-tab-title">{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Links */}
        <div class="sfab-links" role="tabpanel">
          {activeLinks?.map((link, index) => (
            <a
              key={index}
              class="sfab-link"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => config.onLinkClick?.(link.href, activeTab!)}
            >
              <span class="sfab-link-num">{index + 1}</span>
              <span class="sfab-link-text">{link.title}</span>
              <ArrowUpRightIcon class="sfab-link-arrow" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

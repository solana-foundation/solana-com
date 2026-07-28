"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { X } from "react-feather";
import { useTheme } from "../theme-provider";
import {
  allocateHostId,
  closeAskSolana,
  getAskSolanaState,
  isOwnerHost,
  openAskSolana,
  registerHost,
  setAskSolanaView,
  subscribeToAskSolana,
  toggleAskSolana,
  unregisterHost,
  type AskSolanaView,
} from "./store";
import { trackAskSolana } from "./analytics";
import { AskSolanaChatView } from "./chat-view";
import { AskSolanaSearchView } from "./search-view";

function cn(...inputs: classNames.ArgumentArray) {
  return twMerge(classNames(inputs));
}

function useAskSolanaStore() {
  return React.useSyncExternalStore(
    subscribeToAskSolana,
    getAskSolanaState,
    getAskSolanaState,
  );
}

function TabButton({
  label,
  isActive,
  isDark,
  onClick,
}: {
  label: string;
  isActive: boolean;
  isDark: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        "rounded-full px-3 py-1 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#9945FF]",
        isActive
          ? isDark
            ? "bg-white/10 text-white"
            : "bg-gray-100 text-black"
          : isDark
            ? "text-gray-400 hover:text-white"
            : "text-gray-500 hover:text-black",
      )}
    >
      {label}
    </button>
  );
}

function AskSolanaDialog() {
  const t = useTranslations();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { isOpen, view, initialQuery } = useAskSolanaStore();
  const searchParams = useSearchParams();
  const deepLinkQuery = searchParams.get("search")?.trim() ?? "";
  // Key the chat view so "handoff" queries from the search view re-seed it.
  const [chatSeed, setChatSeed] = React.useState({ key: 0, query: "" });

  // ?search= deep link parity with Inkeep: any URL with a non-empty ?search=
  // opens the modal in search view, prefilled.
  React.useEffect(() => {
    if (deepLinkQuery.length > 0) {
      openAskSolana("search", deepLinkQuery);
    }
  }, [deepLinkQuery]);

  // Cmd/Ctrl-K parity with Inkeep's modalSettings.shortcutKey: "k".
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggleAskSolana("search");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      trackAskSolana("docs_ai_chat_opened", { view });
    }
    // Only fire on open/close, not on tab switches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const switchView = (nextView: AskSolanaView) => {
    setAskSolanaView(nextView);
    trackAskSolana("docs_ai_view_switched", { view: nextView });
  };

  const handleAskAI = (query: string) => {
    setChatSeed((seed) => ({ key: seed.key + 1, query }));
    setAskSolanaView("chat");
  };

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => (open ? openAskSolana(view) : closeAskSolana())}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-[60] backdrop-blur-xl",
            isDark ? "bg-black/90" : "bg-black/40",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-[8%] z-[60] flex -translate-x-1/2 flex-col overflow-hidden",
            "h-[min(640px,80vh)] w-[calc(100vw-32px)] max-w-[680px]",
            "rounded-2xl border shadow-[0_32px_64px_rgba(0,0,0,0.5)]",
            isDark
              ? "border-white/10 bg-[#101010]/95 text-white"
              : "border-gray-200 bg-white text-black",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "duration-200",
          )}
        >
          <VisuallyHidden.Root>
            <DialogPrimitive.Title>
              {t("askSolana.title")}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description>
              {t("askSolana.intro")}
            </DialogPrimitive.Description>
          </VisuallyHidden.Root>

          <div
            className={cn(
              "flex items-center justify-between gap-2 border-b px-4 py-3",
              isDark ? "border-white/10" : "border-gray-200",
            )}
          >
            <div className="flex items-center gap-1.5">
              <TabButton
                label={t("askSolana.tabChat")}
                isActive={view === "chat"}
                isDark={isDark}
                onClick={() => switchView("chat")}
              />
              <TabButton
                label={t("askSolana.tabSearch")}
                isActive={view === "search"}
                isDark={isDark}
                onClick={() => switchView("search")}
              />
            </div>
            <DialogPrimitive.Close
              aria-label={t("commands.close")}
              className={cn(
                "rounded p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#9945FF]",
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-400 hover:text-black",
              )}
            >
              <X size={18} />
            </DialogPrimitive.Close>
          </div>

          {view === "chat" ? (
            <AskSolanaChatView
              key={chatSeed.key}
              isDark={isDark}
              initialQuery={chatSeed.query}
            />
          ) : (
            <AskSolanaSearchView
              isDark={isDark}
              initialQuery={initialQuery}
              onAskAI={handleAskAI}
            />
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/**
 * Rendered by every AskSolana entry component. Only the first mounted host
 * (the owner) renders the dialog and its global listeners, so pages with
 * multiple entry points share one modal instance.
 */
export function AskSolanaModalHost() {
  const [hostId] = React.useState(allocateHostId);
  const isOwner = React.useSyncExternalStore(
    subscribeToAskSolana,
    () => isOwnerHost(hostId),
    () => false,
  );

  React.useEffect(() => {
    registerHost(hostId);
    return () => unregisterHost(hostId);
  }, [hostId]);

  if (!isOwner) return null;
  return <AskSolanaDialog />;
}

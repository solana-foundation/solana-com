"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import type {
  AIChatFunctions,
  InkeepEmbeddedSearchAndChatFunctions,
} from "@inkeep/cxkit-react";
import { useInkeepConfig } from "@solana-com/ui-chrome/inkeep-config";
import { DOCS_ASK_CODE_EVENT } from "@/lib/docs/ask-ai";
import {
  DOCS_SEARCH_OPEN_EVENT,
  takeSearchHandOff,
} from "@/lib/docs/search-hand-off";

const InkeepModalSearchAndChat = dynamic(
  () =>
    import("@inkeep/cxkit-react").then((mod) => mod.InkeepModalSearchAndChat),
  {
    ssr: false,
  },
);

/**
 * The docs' openers for Inkeep, beside ui-chrome's InkeepChatButton: the
 * docs header's search field (`openDocsSearch`, with what was typed, and
 * `?q=` on arrival) opens the search, and a code block's Ask button
 * (`openAskAi`) asks the chat about its code.
 */
export function DocsInkeep() {
  const config = useInkeepConfig();
  const { isOpen, onOpenChange } = config.modalSettings;
  // Null until the modal loads (cxkit types it as never null).
  const widget = useRef<InkeepEmbeddedSearchAndChatFunctions>(null!);
  const [view, setView] = useState<"search" | "chat">("search");
  const [query, setQuery] = useState("");
  // Sent once the chat has mounted in the open modal.
  const question = useRef<string | undefined>(undefined);
  const chatRef = useCallback((chat: AIChatFunctions | null) => {
    if (!chat || !question.current) return;
    chat.submitMessage(question.current);
    question.current = undefined;
  }, []);

  useEffect(() => {
    const show = (next: "search" | "chat") => {
      setView(next);
      widget.current?.setView(next);
      onOpenChange(true);
    };
    const search = (text = "") => {
      setQuery(text);
      show("search");
    };
    const onSearch = (event: Event) =>
      search((event as CustomEvent<{ query?: string }>).detail?.query);
    const onAsk = (event: Event) => {
      const code = (event as CustomEvent<{ code?: string }>).detail?.code;
      // The proxy allows 8,000 characters.
      question.current = code?.trim()
        ? `Explain this code from ${document.title}:\n\n\`\`\`\n${code.trim().slice(0, 6000)}\n\`\`\``
        : undefined;
      show("chat");
    };
    window.addEventListener(DOCS_SEARCH_OPEN_EVENT, onSearch);
    window.addEventListener(DOCS_ASK_CODE_EVENT, onAsk);
    const handOff = takeSearchHandOff();
    if (handOff !== null) search(handOff);
    return () => {
      window.removeEventListener(DOCS_SEARCH_OPEN_EVENT, onSearch);
      window.removeEventListener(DOCS_ASK_CODE_EVENT, onAsk);
    };
  }, [onOpenChange]);

  // defaultQuery only applies when the search first mounts, so hand later
  // queries over once it is ready, as ui-chrome's config does for ?search=.
  const searchFunctions = config.searchSettings
    .searchFunctionsRef as RefObject<{
    updateQuery: (query: string) => void;
    focusInput: () => void;
  } | null>;
  useEffect(() => {
    if (!isOpen || !query) return;
    let frame = 0;
    let tries = 0;
    const apply = () => {
      const search = searchFunctions.current;
      if (search) {
        search.updateQuery(query);
        search.focusInput();
      } else if (++tries < 120) {
        frame = requestAnimationFrame(apply);
      }
    };
    apply();
    return () => cancelAnimationFrame(frame);
  }, [isOpen, query, searchFunctions]);

  return (
    <InkeepModalSearchAndChat
      ref={widget}
      defaultView={view}
      baseSettings={config.baseSettings}
      searchSettings={{ ...config.searchSettings, defaultQuery: query }}
      aiChatSettings={{ ...config.aiChatSettings, chatFunctionsRef: chatRef }}
      modalSettings={{ isOpen, onOpenChange, shortcutKey: null }}
    />
  );
}

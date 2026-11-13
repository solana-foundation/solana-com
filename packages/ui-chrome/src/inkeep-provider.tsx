"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import type { InkeepEmbeddedSearchAndChatFunctions } from "@inkeep/cxkit-react";
import { useSiteInkeepConfig } from "./inkeep-site-config";

type View = "search" | "chat";
type InkeepContextValue = {
  isOpen: boolean;
  view: View;
  open: (view: View) => void;
  setIsOpen: (isOpen: boolean) => void;
};
const InkeepContext = createContext<InkeepContextValue | null>(null);
const Modal = dynamic(
  () => import("./inkeep-modal").then((mod) => mod.InkeepModal),
  { ssr: false },
);

function InkeepWidget() {
  const { isOpen, view, open, setIsOpen } = useInkeep();
  const openSearch = useCallback(() => open("search"), [open]);
  const config = useSiteInkeepConfig(isOpen, openSearch);
  const functions = useRef<InkeepEmbeddedSearchAndChatFunctions>({
    setView: () => {},
  });
  useEffect(() => {
    if (isOpen) functions.current?.setView(view);
  }, [isOpen, view]);
  return (
    <Modal
      functionsRef={functions}
      defaultView={view}
      baseSettings={config.baseSettings}
      searchSettings={config.searchSettings}
      aiChatSettings={config.aiChatSettings}
      modalSettings={{ isOpen, onOpenChange: setIsOpen }}
    />
  );
}

export function InkeepProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpenState] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [view, setView] = useState<View>("search");
  const setIsOpen = useCallback((next: boolean) => {
    if (next) setHasOpened(true);
    setIsOpenState(next);
  }, []);
  const open = useCallback(
    (next: View) => {
      setView(next);
      setIsOpen(true);
    },
    [setIsOpen],
  );
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open("search");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);
  const value = useMemo(
    () => ({ isOpen, view, open, setIsOpen }),
    [isOpen, view, open, setIsOpen],
  );
  return (
    <InkeepContext.Provider value={value}>
      {children}
      {hasOpened && (
        <Suspense fallback={null}>
          <InkeepWidget />
        </Suspense>
      )}
    </InkeepContext.Provider>
  );
}

export function useInkeep() {
  const value = useContext(InkeepContext);
  if (!value)
    throw new Error("Inkeep widget must be rendered inside InkeepProvider.");
  return value;
}

export function useOptionalInkeep() {
  return useContext(InkeepContext);
}

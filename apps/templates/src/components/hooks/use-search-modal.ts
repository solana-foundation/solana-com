import { useState, useCallback } from "react";
import { useKeyboardShortcut } from "./use-keyboard-shortcut";

export interface UseSearchModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useSearchModal(): UseSearchModalReturn {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useKeyboardShortcut({
    key: "k",
    metaKey: true,
    onTrigger: open,
  });

  useKeyboardShortcut({
    key: "k",
    ctrlKey: true,
    onTrigger: open,
  });

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

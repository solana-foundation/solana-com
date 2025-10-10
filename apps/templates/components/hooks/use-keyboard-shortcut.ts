import { useEffect, useCallback } from "react";

export interface UseKeyboardShortcutProps {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  onTrigger: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcut({
  key,
  metaKey = false,
  ctrlKey = false,
  shiftKey = false,
  altKey = false,
  onTrigger,
  enabled = true,
}: UseKeyboardShortcutProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      const isMetaMatch = metaKey ? e.metaKey : !e.metaKey;
      const isCtrlMatch = ctrlKey ? e.ctrlKey : !e.ctrlKey;
      const isShiftMatch = shiftKey ? e.shiftKey : !e.shiftKey;
      const isAltMatch = altKey ? e.altKey : !e.altKey;

      if (
        e.key === key &&
        (isMetaMatch || isCtrlMatch) &&
        isShiftMatch &&
        isAltMatch
      ) {
        e.preventDefault();
        onTrigger();
      }
    },
    [key, metaKey, ctrlKey, shiftKey, altKey, onTrigger, enabled],
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, enabled]);
}

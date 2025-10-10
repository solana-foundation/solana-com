import { useState, useCallback } from "react";
import { RepokitTemplate } from "@/lib/generated/repokit";

export interface UseSearchKeyboardReturn {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export interface UseSearchKeyboardProps {
  isFocused: boolean;
  filteredTemplates: RepokitTemplate[];
  query: string;
  onCardClick?: () => void;
  clearSearch: () => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function useSearchKeyboard({
  isFocused,
  filteredTemplates,
  query,
  onCardClick,
  clearSearch,
  inputRef,
}: UseSearchKeyboardProps): UseSearchKeyboardReturn {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (filteredTemplates.length === 0) return;
      } else {
        if (!isFocused || filteredTemplates.length === 0) return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < filteredTemplates.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : filteredTemplates.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && filteredTemplates[activeIndex]) {
            const template = filteredTemplates[activeIndex];
            const internalHref = `/developers/templates/${template.source.id}/${template.name}`;
            window.location.href = internalHref;
            onCardClick?.();
          }
          break;
        case "Escape":
          e.preventDefault();
          if (query) {
            clearSearch();
          } else {
            inputRef.current?.blur();
          }
          setActiveIndex(-1);
          break;
      }
    },
    [
      isFocused,
      filteredTemplates,
      activeIndex,
      query,
      onCardClick,
      clearSearch,
      inputRef,
    ],
  );

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
  };
}

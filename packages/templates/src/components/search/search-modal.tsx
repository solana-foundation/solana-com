"use client";

import { useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { SearchBar } from "./search-bar";
import { useTemplates } from "../../lib/templates/use-templates";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const templates = useTemplates();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    },
    [open, onOpenChange],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-3xl p-0 bg-transparent border-none shadow-none"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Search Templates</DialogTitle>
        <div className="-mt-60">
          <SearchBar
            templates={templates}
            onCardClick={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

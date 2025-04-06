"use client";

import { useEffect, useRef } from "react";

import { MermaidRenderer } from "./mermaid-renderer";
import { X } from "lucide-react";
import { cn } from "@/app/components/utils";

export function MermaidModal({
  content,
  isOpen,
  onClose,
}: {
  content: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm pt-[72px] sm:pt-[80px]"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative overflow-visible border rounded shadow-lg border-ch-border bg-ch-background w-[90vw] h-[calc(100vh-88px)] sm:h-[calc(100vh-96px)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            "border-b-[1px] border-ch-border bg-ch-tabs-background px-3 py-0",
            "w-full h-9 flex items-center justify-between sticky top-0 z-10",
            "text-ch-tab-inactive-foreground text-sm font-mono",
          )}
        >
          <div className="flex items-center w-full h-5 gap-2">
            <span className="leading-none">Diagram</span>
            <div className="flex items-center gap-2 ml-auto mr-1">
              <button
                onClick={onClose}
                className="text-ch-tab-inactive-foreground hover:text-ch-tab-active-foreground focus:outline-none"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={contentRef}
          className="bg-ch-background"
          style={{
            height: "calc(100% - 36px)",
            width: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div className="relative w-full h-full">
            <MermaidRenderer content={content} isModal={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
